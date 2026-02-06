import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('CompanyDetails')
export class Company {
  @PrimaryGeneratedColumn()
  Id: number;
  @Column({ length: 255 })
  CompanyName: string;

  @Column({ length: 10, nullable: true })
  ABBR?: string;

  @Column({ length: 500, nullable: true })
  CompanyLogo?: string;

  @Column({ length: 50, nullable: true })
  TaxId?: string;

  @Column({ length: 100, nullable: true })
  Domain?: string;

  @Column({ type: 'date', nullable: true })
  DateOfEstablishment?: Date;

  @Column({ type: 'date', nullable: true })
  DateOfIncorporation?: Date;

  @Column({ length: 500, nullable: true })
  AddressLine1?: string;

  @Column({ length: 500, nullable: true })
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

  @Column({ length: 500, nullable: true })
  Website?: string;

  @Column({ length: 50, nullable: true })
  GSTNumber?: string;

  @Column({ length: 50, nullable: true })
  PANNumber?: string;

  @Column({ default: true })
  IsActive: boolean;
}
