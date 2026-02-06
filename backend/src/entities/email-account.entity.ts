import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmailDomain } from './email-domain.entity';

@Entity('EmailAccounts')
export class EmailAccount {
  @PrimaryGeneratedColumn()
  Id: number;
  @Column({ length: 255 })
  EmailAddress: string;

  @Column({ length: 255 })
  Domain: string;

  @Column({ length: 255 })
  EmailAccountName: string;

  @Column({ length: 500 })
  EmailPassword: string;

  @Column({ length: 255, nullable: true })
  AlternativeEmailAddress?: string;

  @Column({ type: 'text', nullable: true })
  EmailSignature?: string;

  @Column({ length: 500, nullable: true })
  EmailLogo?: string;

  @Column({ type: 'bit' })
  IsDefaultSending: boolean;

  @Column({ nullable: true })
  EmailDomainId?: number;

  @ManyToOne(() => EmailDomain, { nullable: true })
  @JoinColumn({ name: 'EmailDomainId' })
  emailDomain?: EmailDomain;
}
