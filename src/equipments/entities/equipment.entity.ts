import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Equipment {
  @PrimaryGeneratedColumn("uuid")
  id: string;
}
