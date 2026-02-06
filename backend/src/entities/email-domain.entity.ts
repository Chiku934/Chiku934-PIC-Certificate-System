import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('EmailDomains')
export class EmailDomain {
  @PrimaryGeneratedColumn()
  Id: number;
  @Column({ length: 255 })
  DomainName: string;

  @Column({ length: 255 })
  IncomingServer: string;

  @Column({ type: 'int' })
  IncomingPort: number;

  @Column({ type: 'bit' })
  IncomingIsIMAP: boolean;

  @Column({ type: 'bit' })
  IncomingIsSsl: boolean;

  @Column({ type: 'bit' })
  IncomingIsStartTLs: boolean;

  @Column({ length: 255 })
  OutingServer: string;

  @Column({ type: 'int' })
  OutgoingPort: number;

  @Column({ type: 'bit' })
  OutgoingIsTLs: boolean;

  @Column({ type: 'bit' })
  OutgoingIsSsl: boolean;
}
