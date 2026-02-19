import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Refinery {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  name: string;

  @Column("text", { nullable: true })
  picture: string | null;
}
