import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('EmailDomains')
export class EmailDomain extends BaseEntity {
  @Column({ length: 255 })
  DomainName: string;

  @Column({ length: 500, nullable: true })
  Description?: string;

  @Column({ default: true })
  IsActive: boolean;

  @Column({ length: 100, nullable: true })
  SMTPHost?: string;

  @Column({ type: 'int', nullable: true })
  SMTPPort?: number;

  @Column({ default: false })
  RequiresAuthentication: boolean;

  @Column({ length: 255, nullable: true })
  Username?: string;

  @Column({ length: 255, nullable: true })
  Password?: string;

  @Column({ default: false })
  UseSSL: boolean;
}
