import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Equipment } from './equipment.entity';
import { Location } from './location.entity';
import { User } from './user.entity';

export enum CertificateType {
  INITIAL_LT = 'INITIAL_LT',
  INITIAL_VEHICLE = 'INITIAL_VEHICLE',
  INITIAL_TRANSPORT = 'INITIAL_TRANSPORT',
  PRESSURE_VESSEL = 'PRESSURE_VESSEL',
  NON_DESTRUCTIVE_TEST = 'NON_DESTRUCTIVE_TEST',
  LIFTING_MACHINE = 'LIFTING_MACHINE',
}

export enum CertificateStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  UNDER_REVIEW = 'UNDER_REVIEW',
}

@Entity('Certificates')
export class Certificate {
  @PrimaryGeneratedColumn()
  Id: number;
  @Column({ type: 'varchar', length: 50 })
  CertificateType: CertificateType;

  @Column({ length: 100, unique: true })
  CertificateNumber: string;

  @Column({ type: 'varchar', length: 50, default: CertificateStatus.DRAFT })
  Status: CertificateStatus;

  @Column({ type: 'date' })
  IssueDate: Date;

  @Column({ type: 'date' })
  ExpiryDate: Date;

  @Column({ type: 'date', nullable: true })
  InspectionDate?: Date;

  @Column({ type: 'date', nullable: true })
  NextInspectionDate?: Date;

  @Column({ type: 'text', nullable: true })
  InspectionNotes?: string;

  @Column({ type: 'text', nullable: true })
  CertificateDetails?: string;

  @Column({ length: 255, nullable: true })
  IssuedBy?: string;

  @Column({ length: 255, nullable: true })
  ApprovedBy?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  Capacity?: number;

  @Column({ length: 50, nullable: true })
  CapacityUnit?: string;

  @Column({ type: 'text', nullable: true })
  SpecialConditions?: string;

  @Column({ type: 'text', nullable: true })
  RejectionReason?: string;

  // Foreign keys
  @Column()
  EquipmentId: number;

  @ManyToOne(() => Equipment, { eager: true })
  @JoinColumn({ name: 'EquipmentId' })
  equipment: Equipment;

  @Column()
  LocationId: number;

  @ManyToOne(() => Location, { eager: true })
  @JoinColumn({ name: 'LocationId' })
  location: Location;

  @Column({ nullable: true })
  CreatedById?: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'CreatedById' })
  createdBy?: User;

  @Column({ nullable: true })
  ApprovedById?: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'ApprovedById' })
  approvedBy?: User;

  // Virtual properties
  get isExpired(): boolean {
    return new Date() > this.ExpiryDate;
  }

  get daysUntilExpiry(): number {
    const today = new Date();
    const diffTime = this.ExpiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get isExpiringSoon(): boolean {
    return this.daysUntilExpiry <= 30 && this.daysUntilExpiry > 0;
  }
}
