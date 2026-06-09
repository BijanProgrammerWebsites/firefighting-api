import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Exclude, Transform } from "class-transformer";
import { RoleEnum } from "../../shared/enums/role.enum";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  fullName: string;

  @Column("text", { unique: true })
  username: string;

  @Column("text")
  @Exclude()
  password: string;

  @Column({ type: "enum", enum: RoleEnum })
  role: RoleEnum;

  @Column("text", { nullable: true, default: null })
  @Exclude()
  refreshToken: string | null;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToOne(() => User, { nullable: true })
  @Transform(({ value }) => (value ? value.fullName : null))
  createdBy: User | null;

  @ManyToOne(() => User, { nullable: true })
  @Transform(({ value }) => (value ? value.fullName : null))
  updatedBy: User | null;

  @Column("timestamptz", { nullable: true, default: null })
  lastSignInDate: Date | null;
}
