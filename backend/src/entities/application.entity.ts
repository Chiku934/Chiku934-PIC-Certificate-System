import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { RoleAndApplicationWisePermission } from './role-and-application-wise-permission.entity';

@Entity('Applications')
export class Application extends BaseEntity {
  @Column({ length: 255 })
  ApplicationName: string;

  @Column({ nullable: true })
  Parent?: number;

  @Column({ default: false })
  IsGroup: boolean;

  @Column({ length: 500, nullable: true })
  Url?: string;

  @Column({ length: 255, nullable: true })
  IconImageUrl?: string;

  @Column({ length: 100, nullable: true })
  IconClass?: string;

  @Column({ length: 100 })
  AreaName: string;

  @ManyToOne(() => Application, application => application.Children, { nullable: true })
  @JoinColumn({ name: 'Parent' })
  ParentApplication?: Application;

  @OneToMany(() => Application, application => application.ParentApplication)
  Children: Application[];

  @OneToMany(() => RoleAndApplicationWisePermission, permission => permission.Application)
  RoleAndApplicationWisePermissions: RoleAndApplicationWisePermission[];
}
