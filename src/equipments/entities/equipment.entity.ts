import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Template } from "../../templates/entities/template.entity";
import { Unit } from "../../units/entities/unit.entity";
import { Inspection } from "../../inspections/entities/inspection.entity";

@Entity()
export class Equipment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int" })
  position: number;

  @Column("text")
  title: string;

  @ManyToOne(() => Template, (template) => template.equipments, {
    onDelete: "CASCADE",
  })
  template: Template;

  @OneToMany(() => Inspection, (inspection) => inspection.equipment)
  inspections: Inspection[];

  @ManyToOne(() => Unit, (unit) => unit.equipments, { onDelete: "CASCADE" })
  unit: Unit;
}
