import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Equipment } from './equipment.entity';
import { User } from './user.entity';

export enum EquipmentHistoryType {
  STATUS_CHANGE = 'STATUS_CHANGE',
  LOCATION_CHANGE = 'LOCATION_CHANGE',
  MAINTENANCE = 'MAINTENANCE',
  INSPECTION = 'INSPECTION',
  CERTIFICATE_ISSUED = 'CERTIFICATE_ISSUED',
  MODIFICATION = 'MODIFICATION',
}

@Entity('EquipmentHistory')
export class EquipmentHistory extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  HistoryType: EquipmentHistoryType;

  @Column({ type: 'text' })
  Description: string;

  @Column({ type: 'text', nullable: true })
  OldValue?: string;

  @Column({ type: 'text', nullable: true })
  NewValue?: string;

  @Column({ type: 'nvarchar', length: 'max', nullable: true })
  AdditionalData?: string;

  // Foreign keys
  @Column()
  EquipmentId: number;

  @ManyToOne(() => Equipment, { eager: true })
  @JoinColumn({ name: 'EquipmentId' })
  equipment: Equipment;

  @Column({ nullable: true })
  ChangedById?: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'ChangedById' })
  changedBy?: User;
}
