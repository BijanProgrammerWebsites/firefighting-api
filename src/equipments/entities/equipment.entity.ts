import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Unit } from "../../units/entities/unit.entity";

@Entity()
export class Equipment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int" })
  position: number;

  @ManyToOne(() => Unit, (unit) => unit.equipments, { onDelete: "CASCADE" })
  unit: Unit;
}
