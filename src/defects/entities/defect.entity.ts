import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from "typeorm";
import { Equipment } from "../../equipments/entities/equipment.entity";
import { Answer } from "../../answers/entities/answer.entity";
import { DefectSeverityEnum } from "../../shared/enums/defect-severity.enum";
import { DefectStatusEnum } from "../../shared/enums/defect-status.enum";
import { MaintenanceStatusEnum } from "../../shared/enums/maintenance-status.enum";

@Entity()
export class Defect {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text", { nullable: true, default: null })
  title: string | null;

  @Column("text", { nullable: true, default: null })
  description: string | null;

  @Column({ type: "enum", enum: DefectSeverityEnum })
  severity: DefectSeverityEnum;

  @Column({
    type: "enum",
    enum: DefectStatusEnum,
    default: DefectStatusEnum.OPEN,
  })
  status: DefectStatusEnum;

  @Column({
    type: "enum",
    enum: MaintenanceStatusEnum,
    default: MaintenanceStatusEnum.NOT_STARTED,
  })
  maintenanceStatus: MaintenanceStatusEnum;

  @ManyToOne(() => Equipment, (equipment) => equipment.defects, {
    onDelete: "CASCADE",
  })
  equipment: Equipment;

  @OneToOne(() => Answer)
  @JoinColumn()
  answer: Relation<Answer>;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
