import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('AuditLogs')
export class AuditLog extends BaseEntity {
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
