import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Equipment } from './equipment.entity';
import { User } from './user.entity';

export enum MaintenanceType {
  PREVENTIVE = 'PREVENTIVE',
  CORRECTIVE = 'CORRECTIVE',
  PREDICTIVE = 'PREDICTIVE',
  CONDITION_BASED = 'CONDITION_BASED',
  INSPECTION = 'INSPECTION',
}

export enum MaintenanceStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  OVERDUE = 'OVERDUE',
}

export enum MaintenancePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

@Entity('MaintenanceSchedules')
export class MaintenanceSchedule extends BaseEntity {
  @Column({ length: 255 })
  Title: string;

  @Column({ type: 'text', nullable: true })
  Description?: string;

  @Column({ type: 'varchar', length: 50 })
  MaintenanceType: MaintenanceType;

  @Column({ type: 'varchar', length: 50, default: MaintenanceStatus.SCHEDULED })
  Status: MaintenanceStatus;

  @Column({ type: 'varchar', length: 20, default: MaintenancePriority.MEDIUM })
  Priority: MaintenancePriority;

  @Column({ type: 'datetime' })
  ScheduledDate: Date;

  @Column({ type: 'datetime', nullable: true })
  CompletedDate?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  EstimatedCost?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  ActualCost?: number;

  @Column({ type: 'int', nullable: true })
  EstimatedDurationHours?: number;

  @Column({ type: 'int', nullable: true })
  ActualDurationHours?: number;

  @Column({ type: 'text', nullable: true })
  WorkPerformed?: string;

  @Column({ type: 'text', nullable: true })
  PartsUsed?: string;

  @Column({ type: 'text', nullable: true })
  Notes?: string;

  // Recurring maintenance
  @Column({ default: false })
  IsRecurring: boolean;

  @Column({ type: 'int', nullable: true })
  RecurrenceIntervalDays?: number;

  @Column({ type: 'datetime', nullable: true })
  NextScheduledDate?: Date;

  // Foreign keys
  @Column()
  EquipmentId: number;

  @ManyToOne(() => Equipment, { eager: true })
  @JoinColumn({ name: 'EquipmentId' })
  equipment: Equipment;

  @Column({ nullable: true })
  AssignedToId?: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'AssignedToId' })
  assignedTo?: User;

  @Column({ nullable: true })
  CreatedById?: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'CreatedById' })
  createdBy?: User;

  // Virtual properties
  get isOverdue(): boolean {
    return (
      this.Status === MaintenanceStatus.SCHEDULED && new Date() > this.ScheduledDate
    );
  }

  get daysUntilScheduled(): number {
    const today = new Date();
    const diffTime = this.ScheduledDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
