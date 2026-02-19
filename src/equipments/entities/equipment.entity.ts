import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Unit } from "../../units/entities/unit.entity";

@Entity()
export class Equipment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Unit, (unit) => unit.equipments, { onDelete: "CASCADE" })
  unit: Unit;
}
