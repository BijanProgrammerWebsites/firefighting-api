import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Zone } from "../../zones/entities/zone.entity";
import { Equipment } from "../../equipments/entities/equipment.entity";

@Entity()
export class Unit {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int" })
  position: number;

  @Column("text")
  title: string;

  @ManyToOne(() => Zone, (zone) => zone.units, { onDelete: "CASCADE" })
  zone: Zone;

  @OneToMany(() => Equipment, (equipment) => equipment.unit)
  equipments: Equipment[];
}
