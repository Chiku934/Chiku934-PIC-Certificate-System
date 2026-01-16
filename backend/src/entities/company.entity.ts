import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('CompanyDetails')
export class Company extends BaseEntity {
  @Column({ length: 255 })
  CompanyName: string;

  @Column({ length: 500, nullable: true })
  Address?: string;

  @Column({ length: 100, nullable: true })
  City?: string;

  @Column({ length: 100, nullable: true })
  State?: string;

  @Column({ length: 20, nullable: true })
  PinCode?: string;

  @Column({ length: 100, nullable: true })
  Country?: string;

  @Column({ length: 20, nullable: true })
  PhoneNumber?: string;

  @Column({ length: 255, nullable: true })
  Email?: string;

  @Column({ length: 500, nullable: true })
  Website?: string;

  @Column({ length: 50, nullable: true })
  GSTNumber?: string;

  @Column({ length: 50, nullable: true })
  PANNumber?: string;

  @Column({ default: true })
  IsActive: boolean;
}
