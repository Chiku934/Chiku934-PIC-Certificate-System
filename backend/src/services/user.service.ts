import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: [{ Email: createUserDto.Email }, { UserName: createUserDto.UserName }],
    });

    if (existingUser) {
      throw new ConflictException('User with this email or username already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.Password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      Password: hashedPassword,
      IsActive: true,
    });

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { Id: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
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

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { Email: email } });
    if (!user) {
      console.log(`User not found for email: ${email}`);
      return null;
    }

    if (!user.Password) {
      console.log(`User found but password is null/undefined for email: ${email}`);
      return null;
    }

    if (!password) {
      console.log(`Password parameter is null/undefined for email: ${email}`);
      return null;
    }

    const isValid = await bcrypt.compare(password, user.Password);
    if (isValid) {
      return user;
    } else {
      console.log(`Invalid password for email: ${email}`);
      return null;
    }
  }

  async updateLastLogin(id: number): Promise<void> {
    await this.userRepository.update(id, { LastLoginDate: new Date() });
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.create(createUserDto);
    await this.updateLastLogin(user.Id);
    return this.generateLoginResponse(user, false);
  }

  async login(email: string, password: string, rememberMe: boolean = false) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    await this.updateLastLogin(user.Id);
    return this.generateLoginResponse(user, rememberMe);
  }

  private generateLoginResponse(user: User, rememberMe: boolean = false) {
    const payload = { email: user.Email, sub: user.Id, username: user.UserName };
    const expiresIn = rememberMe ? '30d' : '24h'; // 30 days if remember me, 24 hours otherwise

    return {
      access_token: this.jwtService.sign(payload, { expiresIn }),
      user: {
        id: user.Id,
        username: user.UserName,
        email: user.Email,
        firstName: user.FirstName,
        lastName: user.LastName,
      },
    };
  }
}
