import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
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
  CreatedBy?: number;
  UpdatedBy?: number;
  DeletedBy?: number;

  // Soft delete flag
  IsDeleted: boolean = false;
}
