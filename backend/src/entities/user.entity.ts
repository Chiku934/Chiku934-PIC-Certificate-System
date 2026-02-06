import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRoleMapping } from './user-role-mapping.entity';

@Entity('Users')
export class User {
  @PrimaryGeneratedColumn({ name: 'UserId' })
  UserId: number;

  @Column({ name: 'Email', length: 255 })
  Email: string;

  @Column({ name: 'Password', length: 60 })
  Password: string;

  @Column({ name: 'FirstName', length: 100, nullable: true })
  FirstName?: string;

  @Column({ name: 'MiddleName', length: 100, nullable: true })
  MiddleName?: string;

  @Column({ name: 'LastName', length: 100, nullable: true })
  LastName?: string;

  @Column({ name: 'PhoneNo', length: 20, nullable: true })
  PhoneNo?: string;

  @Column({ name: 'Address', type: 'text', nullable: true })
  Address?: string;

  @Column({ name: 'UserImage', length: 500, nullable: true })
  UserImage?: string;

  @Column({ name: 'DateOfBirth', type: 'datetime', nullable: true })
  DateOfBirth?: Date;

  @Column({ name: 'FailedLoginAttempts', default: 0 })
  FailedLoginAttempts: number;

  @Column({ name: 'LastIpAddress', length: 45, nullable: true })
  LastIpAddress?: string;

  @Column({ name: 'LastLoginDate', type: 'datetime', nullable: true })
  LastLoginDate?: Date;

  @Column({ name: 'LastActivityDate', type: 'datetime', nullable: true })
  LastActivityDate?: Date;

  @Column({ name: 'IsActive', default: true })
  IsActive: boolean;

  @Column({ name: 'UserTypeId', length: 50, nullable: true })
  UserTypeId?: string;

  @Column({ name: 'ResetPasswordToken', length: 500, nullable: true })
  ResetPasswordToken?: string;

  @Column({
    name: 'ResetPasswordTokenExpirey',
    type: 'datetime',
    nullable: true,
  })
  ResetPasswordTokenExpirey?: Date;

  @Column({ name: 'UserType', length: 100, nullable: true })
  UserType?: string;

  @OneToMany(() => UserRoleMapping, (userRoleMapping) => userRoleMapping.User)
  UserRoleMappings: UserRoleMapping[];
}
