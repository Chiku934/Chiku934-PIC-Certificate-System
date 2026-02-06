import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Application } from '../entities/application.entity';
import { Role } from '../entities/role.entity';
import { RoleAndApplicationWisePermission } from '../entities/role-and-application-wise-permission.entity';
import { UserRoleMapping } from '../entities/user-role-mapping.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { Email: createUserDto.Email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.Password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      Password: hashedPassword,
      IsActive: true,
    });

    // Save user first to get the user ID
    const savedUser = await this.userRepository.save(user);

    // Assign roles to the user if roles are provided
    if (
      createUserDto.Roles &&
      Array.isArray(createUserDto.Roles) &&
      createUserDto.Roles.length > 0
    ) {
      await this.assignRolesToUser(savedUser.UserId, createUserDto.Roles);
    }

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { UserId: id },
      relations: ['UserRoleMappings', 'UserRoleMappings.Role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get user roles
    const roles =
      user.UserRoleMappings?.map(
        (mapping) => mapping.Role?.RoleName || 'User',
      ) || [];

    return {
      ...user,
      roles,
      role: roles[0] || 'User', // For backward compatibility
    };
  }

  async findOneForAuth(id: number): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({ where: { UserId: id } });
      return user;
    } catch (error) {
      return null;
    }
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { Email: email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.Password) {
      updateUserDto.Password = await bcrypt.hash(updateUserDto.Password, 10);
    }

    // Handle field name mapping from DTO to entity
    const updateData: any = {
      ...updateUserDto,
      UpdatedDate: new Date(),
      UpdatedBy: updateUserDto.UpdatedBy,
    };

    // Map PhoneNumber (DTO) to PhoneNo (Entity)
    if (updateUserDto.PhoneNumber !== undefined) {
      updateData.PhoneNo = updateUserDto.PhoneNumber;
      delete updateData.PhoneNumber;
    }

    Object.assign(user, updateData);

    // Save user first
    const savedUser = await this.userRepository.save(user);

    // Assign roles to the user if roles are provided (even if empty array to clear roles)
    if (updateUserDto.Roles !== undefined) {
      // If roles array is provided (even empty), assign those roles
      if (Array.isArray(updateUserDto.Roles)) {
        await this.assignRolesToUser(savedUser.UserId, updateUserDto.Roles);
      } else if (typeof updateUserDto.Roles === 'string') {
        // Handle single role as string (convert to array)
        await this.assignRolesToUser(savedUser.UserId, [updateUserDto.Roles]);
      }
    }

    return savedUser;
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { Email: email } });
    if (!user) {
      return null;
    }

    if (!user.Password) {
      return null;
    }

    if (!password) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.Password);
    if (isValid) {
      return user;
    } else {
      return null;
    }
  }

  async updateLastLogin(id: number): Promise<void> {
    await this.userRepository.update(id, { LastLoginDate: new Date() });
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.create(createUserDto);
    await this.updateLastLogin(user.UserId);
    return this.generateLoginResponse(user, false);
  }

  async login(email: string, password: string, rememberMe: boolean = false) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    await this.updateLastLogin(user.UserId);
    return this.generateLoginResponse(user, rememberMe);
  }

  private generateLoginResponse(user: User, rememberMe: boolean = false) {
    const displayName = `${user.FirstName || ''} ${user.LastName || ''}`.trim();

    const payload = {
      email: user.Email,
      sub: user.UserId,
      displayName,
    };
    const expiresIn = rememberMe ? '30d' : '24h'; // 30 days if remember me, 24 hours otherwise

    return {
      access_token: this.jwtService.sign(payload, { expiresIn }),
      user: {
        id: user.UserId,
        displayName,
        email: user.Email,
        firstName: user.FirstName,
        lastName: user.LastName,
      },
    };
  }

  async getUserMenu(userId: number): Promise<Application[]> {
    const user = await this.userRepository.findOne({
      where: { UserId: userId },
      relations: ['UserRoleMappings', 'UserRoleMappings.Role'],
    });

    if (!user || !user.UserRoleMappings) {
      return [];
    }

    const roleIds = user.UserRoleMappings.map((urm) => urm.RoleId);

    // Get parent applications that user has access to
    const permissions = await this.userRepository.manager
      .getRepository(RoleAndApplicationWisePermission)
      .find({
        where: {
          RoleId: In(roleIds),
          Application: { Parent: null },
        },
        relations: ['Application'],
      });

    const applications: Application[] = [];

    for (const permission of permissions) {
      if (
        !applications.find(
          (app) => app.ApplicationId === permission.ApplicationId,
        )
      ) {
        const app = permission.Application;
        app.Children = [];

        // Get child applications
        const childPermissions = await this.userRepository.manager
          .getRepository(RoleAndApplicationWisePermission)
          .find({
            where: {
              RoleId: In(roleIds),
              Application: { Parent: app.ApplicationId },
            },
            relations: ['Application'],
          });

        for (const childPerm of childPermissions) {
          const childApp = childPerm.Application;
          childApp.Children = [];

          // Get grandchild applications
          const grandChildPermissions = await this.userRepository.manager
            .getRepository(RoleAndApplicationWisePermission)
            .find({
              where: {
                RoleId: In(roleIds),
                Application: { Parent: childApp.ApplicationId },
              },
              relations: ['Application'],
            });

          childApp.Children = grandChildPermissions.map(
            (gcp) => gcp.Application,
          );
          app.Children.push(childApp);
        }

        applications.push(app);
      }
    }

    return applications;
  }

  async getProfile(userId: number): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { UserId: userId },
      relations: ['UserRoleMappings', 'UserRoleMappings.Role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Get user roles
    const roles =
      user.UserRoleMappings?.map(
        (mapping) => mapping.Role?.RoleName || 'User',
      ) || [];

    const displayName = `${user.FirstName || ''} ${user.LastName || ''}`.trim();

    return {
      UserId: user.UserId,
      UserName: user.Email,
      Email: user.Email,
      FirstName: user.FirstName,
      MiddleName: user.MiddleName,
      LastName: user.LastName,
      PhoneNo: user.PhoneNo,
      Address: user.Address,
      UserImage: user.UserImage,
      roles,
      displayName,
      role: roles[0] || 'User',
      userRole: roles[0] || 'User',
      roleName: roles[0] || 'User',
      userType: roles[0] || 'User',
    };
  }

  async assignRolesToUser(userId: number, roleNames: string[]): Promise<void> {
    if (!roleNames || roleNames.length === 0) {
      return;
    }

    // Ensure roleNames is an array
    const rolesToAssign = Array.isArray(roleNames) ? roleNames : [roleNames];

    const user = await this.userRepository.findOne({
      where: { UserId: userId },
      relations: ['UserRoleMappings'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Remove existing role mappings
    if (user.UserRoleMappings && user.UserRoleMappings.length > 0) {
      await this.userRepository.manager.remove(user.UserRoleMappings);
    }

    // Get all roles to perform case-insensitive matching
    const allRoles = await this.userRepository.manager
      .getRepository(Role)
      .find();

    const validRoles = allRoles.filter((role) =>
      rolesToAssign.some(
        (r) => r.toLowerCase() === role.RoleName.toLowerCase(),
      ),
    );

    if (validRoles.length === 0) {
      console.log(`No valid roles found for: ${rolesToAssign.join(', ')}`);
      console.log(`Available roles: ${allRoles.map(r => r.RoleName).join(', ')}`);
      return;
    }

    // Add new role mappings
    for (const role of validRoles) {
      const userRoleMapping = this.userRepository.manager.create(
        UserRoleMapping,
        {
          UserId: userId,
          RoleId: role.Id,
          CreatedDate: new Date(),
          UpdatedDate: new Date(),
        },
      );
      await this.userRepository.manager.save(userRoleMapping);
      console.log(`Assigned role ${role.RoleName} to user ${userId}`);
    }
  }
}
