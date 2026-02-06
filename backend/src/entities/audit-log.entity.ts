import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('AuditLogs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  Id: number;
  @Column()
  ActivityLogTypeId: number;

  @Column({ nullable: true })
  EntityId?: number;

  @Column({ length: 255 })
  EntityName: string;

  @Column()
  UserId: number;

  @Column({ type: 'text' })
  Comment: string;

  @Column({ length: 45, nullable: true })
  IpAddress?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'UserId' })
  User: User;
}
