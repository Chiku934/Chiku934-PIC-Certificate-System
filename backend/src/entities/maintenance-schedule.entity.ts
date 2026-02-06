import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Equipment } from './equipment.entity';

@Entity('MaintenanceSchedules')
export class MaintenanceSchedule {
  @PrimaryGeneratedColumn()
  Id: number;
  @Column({ nullable: true })
  EquipmentId?: number;

  @ManyToOne(() => Equipment, { nullable: true })
  @JoinColumn({ name: 'EquipmentId' })
  equipment?: Equipment;

  @Column({ type: 'date', nullable: true })
  ScheduleDate?: Date;

  @Column({ length: 255, nullable: true })
  MaintenanceType?: string;

  @Column({ type: 'text', nullable: true })
  Description?: string;

  @Column({ type: 'bit' })
  IsCompleted: boolean;

  @Column({ type: 'date', nullable: true })
  CompletedDate?: Date;

  @Column({ length: 500, nullable: true })
  Notes?: string;
}
