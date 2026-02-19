import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Zone {
  @PrimaryGeneratedColumn("uuid")
  id: string;
}
