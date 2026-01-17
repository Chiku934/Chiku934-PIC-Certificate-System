import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('LetterHeads')
export class LetterHead extends BaseEntity {
  @Column({ length: 255 })
  LetterHeadName: string;

  @Column({ length: 500, nullable: true })
  LetterHeadImage?: string;

  @Column({ length: 50, nullable: true })
  LetterHeadImageHeight?: string;

  @Column({ length: 50, nullable: true })
  LetterHeadImageWidth?: string;

  @Column({ length: 20, default: 'center' })
  LetterHeadAlign: string;

  @Column({ length: 500, nullable: true })
  LetterHeadFooterImage?: string;

  @Column({ length: 50, nullable: true })
  LetterHeadImageFooterHeight?: string;

  @Column({ length: 50, nullable: true })
  LetterHeadImageFooterWidth?: string;

  @Column({ length: 20, default: 'center' })
  LetterHeadFooterAlign: string;
}
