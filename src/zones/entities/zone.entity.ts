import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Site } from "../../sites/entities/site.entity";
import { Unit } from "../../units/entities/unit.entity";

@Entity()
export class Zone {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Site, (site) => site.zones, { onDelete: "CASCADE" })
  site: Site;

  @OneToMany(() => Unit, (unit) => unit.zone)
  units: Unit[];
}
