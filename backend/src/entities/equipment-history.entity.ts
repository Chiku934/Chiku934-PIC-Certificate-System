import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Equipment } from './equipment.entity';

@Entity('EquipmentHistory')
export class EquipmentHistory {
  @PrimaryGeneratedColumn()
  Id: number;
  @Column({ nullable: true })
  EquipmentId?: number;

  @ManyToOne(() => Equipment, { nullable: true })
  @JoinColumn({ name: 'EquipmentId' })
  equipment?: Equipment;

  @Column({ type: 'text', nullable: true })
  HistoryDetails?: string;

  @Column({ type: 'date', nullable: true })
  HistoryDate?: Date;

  @Column({ length: 255, nullable: true })
  ActionType?: string;

  @Column({ length: 500, nullable: true })
  ActionDescription?: string;
}
