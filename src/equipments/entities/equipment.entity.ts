import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Unit } from "../../units/entities/unit.entity";

@Entity()
export class Equipment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int" })
  position: number;

  @Column("text")
  title: string;

  @ManyToOne(() => Unit, (unit) => unit.equipments, { onDelete: "CASCADE" })
  unit: Unit;
}
