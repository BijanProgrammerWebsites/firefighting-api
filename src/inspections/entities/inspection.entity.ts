import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Equipment } from "../../equipments/entities/equipment.entity";
import { Answer } from "../../answers/entities/answer.entity";

@Entity()
export class Inspection {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToOne(() => Equipment, (equipment) => equipment.inspections)
  equipment: Equipment;

  @OneToMany(() => Answer, (answer) => answer.inspection, { cascade: true })
  answers: Answer[];
}
