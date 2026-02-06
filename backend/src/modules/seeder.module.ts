import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { AdminUserSeeder } from '../seeders/admin-user.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AdminUserSeeder],
  exports: [AdminUserSeeder],
})
export class SeederModule implements OnModuleInit {
  constructor(
    private readonly adminUserSeeder: AdminUserSeeder
  ) {}

  async onModuleInit(): Promise<void> {
    await this.adminUserSeeder.seed();
  }
}
