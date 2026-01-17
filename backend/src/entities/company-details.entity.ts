import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('CompanyDetails')
export class CompanyDetails extends BaseEntity {
  @Column({ length: 255 })
  CompanyName: string;

  @Column({ length: 50 })
  ABBR: string;

  @Column({ length: 500, nullable: true })
  CompanyLogo?: string;

  @Column({ length: 100, nullable: true })
  TaxId?: string;

  @Column({ length: 255, nullable: true })
  Domain?: string;

  @Column({ type: 'date', nullable: true })
  DateOfEstablishment?: Date;

  @Column({ type: 'date', nullable: true })
  DateOfIncorporation?: Date;

  @Column({ length: 255, nullable: true })
  AddressLine1?: string;

  @Column({ length: 255, nullable: true })
  AddressLine2?: string;

  @Column({ length: 100, nullable: true })
  City?: string;

  @Column({ length: 100, nullable: true })
  State?: string;

  @Column({ length: 100, nullable: true })
  Country?: string;

  @Column({ length: 20, nullable: true })
  PostalCode?: string;

  @Column({ length: 255, nullable: true })
  EmailAddress?: string;

  @Column({ length: 20, nullable: true })
  PhoneNumber?: string;

  @Column({ length: 20, nullable: true })
  Fax?: string;

  @Column({ length: 255, nullable: true })
  Website?: string;
}
