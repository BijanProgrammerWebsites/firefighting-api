import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Equipment } from "../../equipments/entities/equipment.entity";
import { Answer } from "../../answers/entities/answer.entity";
import { EquipmentStatusEnum } from "../../shared/enums/equipment-status.enum";

@Entity()
export class Inspection {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: EquipmentStatusEnum })
  status: EquipmentStatusEnum;

  @CreateDateColumn()
  createdDate: Date;

  @ManyToOne(() => Equipment, (equipment) => equipment.inspections, {
    onDelete: "CASCADE",
  })
  equipment: Equipment;

  @OneToMany(() => Answer, (answer) => answer.inspection, { cascade: true })
  answers: Answer[];
}
