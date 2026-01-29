import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserRoleMapping } from './user-role-mapping.entity';

@Entity('Users')
export class User extends BaseEntity {
  @Column({ length: 255 })
  Email: string;

  @Column({ length: 255 })
  Password: string;

  @Column({ length: 100, nullable: true })
  FirstName?: string;

  @Column({ length: 100, nullable: true })
  MiddleName?: string;

  @Column({ length: 100, nullable: true })
  LastName?: string;

  @Column({ length: 20, nullable: true })
  PhoneNumber?: string;

  @Column({ type: 'text', nullable: true })
  Address?: string;

  @Column({ length: 500, nullable: true })
  UserImage?: string;

  @Column({ default: true })
  IsActive: boolean;

  @Column({ type: 'datetime', nullable: true })
  LastLoginDate?: Date;

  // Relations will be added as we create related entities
  // @OneToMany(() => Certificate, certificate => certificate.CreatedBy)
  // certificates: Certificate[];

  @OneToMany(() => UserRoleMapping, (userRoleMapping) => userRoleMapping.User)
  UserRoleMappings: UserRoleMapping[];
}
