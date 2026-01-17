import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Role } from './role.entity';

@Entity('UserRoleMappings')
export class UserRoleMapping extends BaseEntity {
  @Column()
  UserId: number;

  @Column()
  RoleId: number;

  @ManyToOne(() => Role, role => role.UserRoleMappings)
  @JoinColumn({ name: 'RoleId' })
  Role: Role;

  @ManyToOne(() => User, user => user.UserRoleMappings)
  @JoinColumn({ name: 'UserId' })
  User: User;
}
