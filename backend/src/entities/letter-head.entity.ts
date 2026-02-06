import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('LetterHeads')
export class LetterHead {
  @PrimaryGeneratedColumn()
  Id: number;
  @Column({ length: 255 })
  LetterHeadName: string;

  @Column({ length: 500, nullable: true })
  LetterHeadImage?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  LetterHeadImageHeight?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  LetterHeadImageWidth?: number;

  @Column({ length: 50, nullable: true })
  LetterHeadAlign?: string;

  @Column({ length: 500, nullable: true })
  LetterHeadFooterImage?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  LetterHeadImageFooterHeight?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  LetterHeadImageFooterWidth?: number;

  @Column({ length: 50, nullable: true })
  LetterHeadFooterAlign?: string;
}
