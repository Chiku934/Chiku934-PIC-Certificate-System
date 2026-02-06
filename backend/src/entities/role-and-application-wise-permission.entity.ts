import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Application } from './application.entity';

@Entity('RoleAndApplicationWisePermissions')
export class RoleAndApplicationWisePermission {
  @PrimaryGeneratedColumn()
  Id: number;
  @Column()
  ApplicationId: number;

  @Column()
  RoleId: number;

  @ManyToOne(
    () => Application,
    (application) => application.RoleAndApplicationWisePermissions,
  )
  @JoinColumn({ name: 'ApplicationId' })
  Application: Application;

  @ManyToOne(() => Role, (role) => role.RoleAndApplicationWisePermissions)
  @JoinColumn({ name: 'RoleId' })
  Role: Role;
}
