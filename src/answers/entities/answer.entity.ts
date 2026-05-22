import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from "typeorm";
import { Inspection } from "../../inspections/entities/inspection.entity";
import { Question } from "../../questions/entities/question.entity";
import { Defect } from "../../defects/entities/defect.entity";

@Entity()
export class Answer {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  text: string;

  @Column("text", { nullable: true, default: null })
  picture: string | null;

  @ManyToOne(() => Inspection, (inspection) => inspection.answers, {
    onDelete: "CASCADE",
  })
  inspection: Inspection;

  @ManyToOne(() => Question, { onDelete: "CASCADE" })
  question: Question;

  @OneToOne(() => Defect, (defect) => defect.answer, {
    nullable: true,
    cascade: true,
  })
  defect: Relation<Defect> | null;
}
