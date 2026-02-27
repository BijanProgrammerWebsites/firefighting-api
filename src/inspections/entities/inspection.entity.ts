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
import { StatusEnum } from "../../shared/enums/status.enum";

@Entity()
export class Inspection {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: StatusEnum })
  status: StatusEnum;

  @Column({ type: "float" })
  score: number;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToOne(() => Equipment, (equipment) => equipment.inspections, {
    onDelete: "CASCADE",
  })
  equipment: Equipment;

  @OneToMany(() => Answer, (answer) => answer.inspection, { cascade: true })
  answers: Answer[];
}
