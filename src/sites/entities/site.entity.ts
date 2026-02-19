import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Site {
  @PrimaryGeneratedColumn("uuid")
  id: string;
}
