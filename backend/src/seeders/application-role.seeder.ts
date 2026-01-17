import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from '../entities/application.entity';
import { Role } from '../entities/role.entity';
import { RoleAndApplicationWisePermission } from '../entities/role-and-application-wise-permission.entity';
import { UserRoleMapping } from '../entities/user-role-mapping.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class ApplicationRoleSeeder {
  private readonly logger = new Logger(ApplicationRoleSeeder.name);

  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(RoleAndApplicationWisePermission)
    private readonly permissionRepository: Repository<RoleAndApplicationWisePermission>,
    @InjectRepository(UserRoleMapping)
    private readonly userRoleMappingRepository: Repository<UserRoleMapping>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed(): Promise<void> {
    try {
      this.logger.log('Starting application and role seeding...');

      // Seed Applications
      const applications = [
        {
          ApplicationName: 'Setup',
          Url: '/setup',
          IconImageUrl: '/assets/setup-icon.png',
          AreaName: 'Setup',
          IsGroup: false,
        },
        {
          ApplicationName: 'Certification',
          Url: '/certification',
          IconImageUrl: '/assets/certification-icon.png',
          AreaName: 'Certification',
          IsGroup: false,
        },
        {
          ApplicationName: 'Audit',
          Url: '/audit',
          IconImageUrl: '/assets/audit-icon.png',
          AreaName: 'Audit',
          IsGroup: false,
        },
      ];

      const savedApplications: Application[] = [];

      for (const appData of applications) {
        let app = await this.applicationRepository.findOne({
          where: { ApplicationName: appData.ApplicationName }
        });

        if (!app) {
          app = this.applicationRepository.create(appData);
          app = await this.applicationRepository.save(app);
          this.logger.log(`Created application: ${app.ApplicationName} with ID: ${app.Id}`);
        } else {
          this.logger.log(`Application already exists: ${app.ApplicationName} with ID: ${app.Id}`);
        }
        savedApplications.push(app);
      }

      // Seed Roles
      const roles = [
        { RoleName: 'Administrator' },
        { RoleName: 'Manager' },
        { RoleName: 'User' },
      ];

      const savedRoles: Role[] = [];

      for (const roleData of roles) {
        let role = await this.roleRepository.findOne({
          where: { RoleName: roleData.RoleName }
        });

        if (!role) {
          role = this.roleRepository.create(roleData);
          role = await this.roleRepository.save(role);
          this.logger.log(`Created role: ${role.RoleName}`);
        }
        savedRoles.push(role);
      }

      // Seed Permissions - Give Administrator access to all applications
      const adminRole = savedRoles.find(r => r.RoleName === 'Administrator');
      if (adminRole) {
        for (const app of savedApplications) {
          let permission = await this.permissionRepository.findOne({
            where: { ApplicationId: app.Id, RoleId: adminRole.Id }
          });

          if (!permission) {
            permission = this.permissionRepository.create({
              ApplicationId: app.Id,
              RoleId: adminRole.Id,
            });
            await this.permissionRepository.save(permission);
            this.logger.log(`Created permission: Admin -> ${app.ApplicationName}`);
          }
        }
      }

      // Assign admin role to admin user
      const adminUser = await this.userRepository.findOne({
        where: { Email: 'admin@drs2026.co.in' }
      });

      if (adminUser && adminRole) {
        let userRoleMapping = await this.userRoleMappingRepository.findOne({
          where: { UserId: adminUser.Id, RoleId: adminRole.Id }
        });

        if (!userRoleMapping) {
          userRoleMapping = this.userRoleMappingRepository.create({
            UserId: adminUser.Id,
            RoleId: adminRole.Id,
          });
          await this.userRoleMappingRepository.save(userRoleMapping);
          this.logger.log('Assigned admin role to admin user');
        }
      }

      this.logger.log('Application and role seeding completed successfully');

    } catch (error) {
      this.logger.error('Error seeding applications and roles:', error);
      throw error;
    }
  }
}
