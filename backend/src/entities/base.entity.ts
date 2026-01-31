import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  Id: number;

  @CreateDateColumn()
  CreatedDate: Date;

  @UpdateDateColumn()
  UpdatedDate: Date;

  @DeleteDateColumn({ nullable: true })
  DeletedDate?: Date;

  // User tracking fields
  @Column({ type: 'int', nullable: true })
  CreatedBy?: number;

  @Column({ type: 'int', nullable: true })
  UpdatedBy?: number;

  @Column({ type: 'int', nullable: true })
  DeletedBy?: number;

  // Soft delete flag
  @Column({ type: 'bit', default: false })
  IsDeleted: boolean = false;
}
