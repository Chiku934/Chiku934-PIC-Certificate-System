import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';

@Injectable()
export class AdminUserSeeder {
  private readonly logger = new Logger(AdminUserSeeder.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed(): Promise<void> {
    try {
      this.logger.log('Starting admin user seeding...');

      // Check if admin user already exists
      const existingAdmin = await this.userRepository.findOne({
        where: { Email: 'admin@drs2026.co.in' },
      });

      this.logger.log(`Admin user lookup result: ${existingAdmin ? 'Found' : 'Not found'}`);

      if (existingAdmin && existingAdmin.Password) {
        this.logger.log(
          'Admin user already exists with password, updating with new information...',
        );
        // Update existing user with new information
        existingAdmin.FirstName = 'DRS';
        existingAdmin.LastName = '@2026';
        existingAdmin.PhoneNo = '9348178871';
        existingAdmin.Address = 'Jharkhand';
        existingAdmin.IsActive = true;
        await this.userRepository.save(existingAdmin);
        this.logger.log('Admin user updated with new information successfully');
        return;
      }

      if (existingAdmin && !existingAdmin.Password) {
        // Update existing user with password
        this.logger.log('Updating existing admin user with password...');
        const hashedPassword = await bcrypt.hash('Drs@2026', 10);
        existingAdmin.Password = hashedPassword;
        // UserName field removed - using Email as primary identifier
        existingAdmin.FirstName = 'DRS';
        existingAdmin.LastName = '@2026';
        existingAdmin.PhoneNo = '9348178871';
        existingAdmin.IsActive = true;
        await this.userRepository.save(existingAdmin);
        this.logger.log('Admin user updated with password successfully');
        return;
      }

      // Create new admin user
      this.logger.log('Creating new admin user...');
      const hashedPassword = await bcrypt.hash('Drs@2026', 10);

      const adminUser = this.userRepository.create({
        Email: 'admin@drs2026.co.in',
        Password: hashedPassword,
        FirstName: 'DRS',
        LastName: '@2026',
        PhoneNo: '9348178871',
        Address: 'Jharkhand',
        IsActive: true,
      });

      const savedUser = await this.userRepository.save(adminUser);
      this.logger.log(
        `Admin user created successfully with ID: ${savedUser.UserId}`,
      );

    } catch (error) {
      this.logger.error('Error seeding admin user:', error);
      throw error;
    }
  }
}
