import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Unit {
  @PrimaryGeneratedColumn("uuid")
  id: string;
}
