import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { Exclude } from "class-transformer";
import { RoleEnum } from "../../shared/enums/role.enum";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

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
}
