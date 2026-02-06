import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../services/user.service';

async function updateAdminUser() {
  const app = await NestFactory.create(AppModule);
  
  try {
    const userService = app.get(UserService);
    
    console.log('Updating admin user...');
    
    // Find the admin user
    const adminUser = await userService.findByEmail('admin@drs2026.co.in');
    
    if (adminUser) {
      console.log(`Found admin user: ${adminUser.Email}`);
      
      // Update user information
      const updatedUser = await userService.update(adminUser.UserId, {
        FirstName: 'DRS',
        LastName: '@2026',
        PhoneNumber: '9348178871',
        Address: 'Jharkhand',
        IsActive: true,
        Roles: ['Administrator', 'Admin'] // Assign both roles
      });
      
      console.log('Admin user updated successfully!');
      console.log('Updated user:', {
        id: updatedUser.UserId,
        email: updatedUser.Email,
        firstName: updatedUser.FirstName,
        lastName: updatedUser.LastName,
        phoneNumber: updatedUser.PhoneNo,
        address: updatedUser.Address
      });
    } else {
      console.log('Admin user not found in database');
    }
    
  } catch (error) {
    console.error('Error updating admin user:', error);
  } finally {
    await app.close();
  }
}

updateAdminUser();
