import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Company } from './company.entity';

@Entity('Locations')
export class Location extends BaseEntity {
  @Column({ length: 255 })
  LocationName: string;

  @Column({ length: 100, nullable: true })
  LocationCode?: string;

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

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  Latitude?: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  Longitude?: number;

  @Column({ length: 50, nullable: true })
  LocationType?: string; // Facility, Warehouse, Office, etc.

  @Column({ length: 100, nullable: true })
  ContactPerson?: string;

  @Column({ length: 20, nullable: true })
  ContactNumber?: string;

  @Column({ length: 255, nullable: true })
  ContactEmail?: string;

  @Column({ type: 'text', nullable: true })
  Description?: string;

  @Column({ default: true })
  IsActive: boolean;

  // Parent location for hierarchy (optional)
  @Column({ nullable: true })
  ParentLocationId?: number;

  @ManyToOne(() => Location, { nullable: true })
  @JoinColumn({ name: 'ParentLocationId' })
  parentLocation?: Location;

  // Child locations
  @OneToMany(() => Location, (location) => location.parentLocation)
  childLocations?: Location[];

  // Foreign key to Company
  @Column({ nullable: true })
  CompanyId?: number;

  @ManyToOne(() => Company, { nullable: true })
  @JoinColumn({ name: 'CompanyId' })
  company?: Company;

  // Virtual property for full location path
  get fullLocationPath(): string {
    if (this.parentLocation) {
      return `${this.parentLocation.fullLocationPath} > ${this.LocationName}`;
    }
    return this.LocationName;
  }
}
