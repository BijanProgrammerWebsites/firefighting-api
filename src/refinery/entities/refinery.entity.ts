import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Site } from "../../sites/entities/site.entity";

@Entity()
export class Refinery {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  title: string;

  @Column("text", { nullable: true, default: null })
  picture: string | null;

  @OneToMany(() => Site, (site) => site.refinery)
  sites: Site[];
}
