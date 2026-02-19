import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Refinery } from "../../refinery/entities/refinery.entity";
import { Zone } from "../../zones/entities/zone.entity";

@Entity()
export class Site {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Refinery, (refinery) => refinery.sites, {
    onDelete: "CASCADE",
  })
  refinery: Refinery;

  @OneToMany(() => Zone, (zone) => zone.site)
  zones: Zone[];
}
