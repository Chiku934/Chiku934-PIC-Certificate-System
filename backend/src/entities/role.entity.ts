import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRoleMapping } from './user-role-mapping.entity';
import { RoleAndApplicationWisePermission } from './role-and-application-wise-permission.entity';

@Entity('Roles')
export class Role {
  @PrimaryGeneratedColumn()
  Id: number;
  @Column({ length: 100 })
  RoleName: string;

  @OneToMany(() => UserRoleMapping, (userRoleMapping) => userRoleMapping.Role)
  UserRoleMappings: UserRoleMapping[];

  @OneToMany(
    () => RoleAndApplicationWisePermission,
    (permission) => permission.Role,
  )
  RoleAndApplicationWisePermissions: RoleAndApplicationWisePermission[];
}
