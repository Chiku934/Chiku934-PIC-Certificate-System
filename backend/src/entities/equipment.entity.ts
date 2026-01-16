import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Company } from './company.entity';

@Entity('Equipment')
export class Equipment extends BaseEntity {
  @Column({ length: 255 })
  EquipmentName: string;

  @Column({ length: 100, nullable: true })
  EquipmentType?: string;

  @Column({ length: 50, nullable: true })
  SerialNumber?: string;

  @Column({ length: 100, nullable: true })
  ModelNumber?: string;

  @Column({ length: 255, nullable: true })
  Manufacturer?: string;

  @Column({ type: 'date', nullable: true })
  ManufacturingDate?: Date;

  @Column({ type: 'date', nullable: true })
  InstallationDate?: Date;

  @Column({ length: 500, nullable: true })
  Location?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  Capacity?: number;

  @Column({ length: 50, nullable: true })
  CapacityUnit?: string;

  @Column({ length: 100, nullable: true })
  Status?: string; // Active, Inactive, Under Maintenance, etc.

  @Column({ type: 'text', nullable: true })
  Description?: string;

  @Column({ type: 'date', nullable: true })
  LastInspectionDate?: Date;

  @Column({ type: 'date', nullable: true })
  NextInspectionDate?: Date;

  // Foreign key to Company
  @Column({ nullable: true })
  CompanyId?: number;

  @ManyToOne(() => Company, { nullable: true })
  @JoinColumn({ name: 'CompanyId' })
  company?: Company;
}
