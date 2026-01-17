import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserRoleMapping } from './user-role-mapping.entity';
import { RoleAndApplicationWisePermission } from './role-and-application-wise-permission.entity';

@Entity('Roles')
export class Role extends BaseEntity {
  @Column({ length: 100 })
  RoleName: string;

  @OneToMany(() => UserRoleMapping, userRoleMapping => userRoleMapping.Role)
  UserRoleMappings: UserRoleMapping[];

  @OneToMany(() => RoleAndApplicationWisePermission, permission => permission.Role)
  RoleAndApplicationWisePermissions: RoleAndApplicationWisePermission[];
}
