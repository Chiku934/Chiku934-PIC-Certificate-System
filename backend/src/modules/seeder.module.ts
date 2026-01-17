import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Application } from '../entities/application.entity';
import { Role } from '../entities/role.entity';
import { RoleAndApplicationWisePermission } from '../entities/role-and-application-wise-permission.entity';
import { UserRoleMapping } from '../entities/user-role-mapping.entity';
import { AdminUserSeeder } from '../seeders/admin-user.seeder';
import { ApplicationRoleSeeder } from '../seeders/application-role.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([User, Application, Role, RoleAndApplicationWisePermission, UserRoleMapping])],
  providers: [AdminUserSeeder, ApplicationRoleSeeder],
  exports: [AdminUserSeeder, ApplicationRoleSeeder],
})
export class SeederModule implements OnModuleInit {
  constructor(
    private readonly adminUserSeeder: AdminUserSeeder,
    private readonly applicationRoleSeeder: ApplicationRoleSeeder
  ) {}

  async onModuleInit(): Promise<void> {
    await this.adminUserSeeder.seed();
    await this.applicationRoleSeeder.seed();
  }
}
