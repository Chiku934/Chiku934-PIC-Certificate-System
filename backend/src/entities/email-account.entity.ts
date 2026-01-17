import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('EmailAccounts')
export class EmailAccount extends BaseEntity {
  @Column({ length: 255 })
  AccountName: string;

  @Column({ length: 255 })
  EmailAddress: string;

  @Column({ length: 500, nullable: true })
  Description?: string;

  @Column({ length: 100 })
  SMTPHost: string;

  @Column({ type: 'int', default: 587 })
  SMTPPort: number;

  @Column({ length: 255 })
  Username: string;

  @Column({ length: 255 })
  Password: string;

  @Column({ default: true })
  UseSSL: boolean;

  @Column({ default: true })
  UseTLS: boolean;

  @Column({ default: true })
  IsActive: boolean;

  @Column({ type: 'int', nullable: true })
  EmailDomainId?: number;
}
