import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from './company.entity';

@Entity('Locationess')
export class Location {
  @PrimaryGeneratedColumn()
  Id: number;
  @Column({ length: 255 })
  LocationName: string;

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
