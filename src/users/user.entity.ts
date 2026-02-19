import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { Exclude } from "class-transformer";
import { Role } from "../shared/enums/role.enum";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text", { unique: true })
  username: string;

  @Column("text")
  @Exclude()
  password: string;

  @Column({ type: "enum", enum: Role })
  role: Role;

  @Column("text", { nullable: true, default: null })
  @Exclude()
  refreshToken: string | null;
}
