import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Application } from './application.entity';
import { Role } from './role.entity';

@Entity('RoleAndApplicationWisePermissions')
export class RoleAndApplicationWisePermission extends BaseEntity {
  @Column()
  ApplicationId: number;

  @Column()
  RoleId: number;

  @ManyToOne(() => Application, application => application.RoleAndApplicationWisePermissions)
  @JoinColumn({ name: 'ApplicationId' })
  Application: Application;

  @ManyToOne(() => Role, role => role.RoleAndApplicationWisePermissions)
  @JoinColumn({ name: 'RoleId' })
  Role: Role;
}
