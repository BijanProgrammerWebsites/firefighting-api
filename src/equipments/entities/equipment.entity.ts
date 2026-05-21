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
import { Defect } from "../../defects/entities/defect.entity";
import { EquipmentStatusEnum } from "../../shared/enums/equipment-status.enum";

@Entity()
export class Equipment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int" })
  position: number;

  @Column("text")
  title: string;

  @Column({
    type: "enum",
    enum: EquipmentStatusEnum,
    default: EquipmentStatusEnum.IN_SERVICE,
  })
  status: EquipmentStatusEnum;

  @ManyToOne(() => Template, (template) => template.equipments, {
    onDelete: "CASCADE",
  })
  template: Template;

  @OneToMany(() => Inspection, (inspection) => inspection.equipment)
  inspections: Inspection[];

  @OneToMany(() => Defect, (defect) => defect.equipment)
  defects: Defect[];

  @ManyToOne(() => Unit, (unit) => unit.equipments, { onDelete: "CASCADE" })
  unit: Unit;
}
