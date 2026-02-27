import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Inspection } from "../../inspections/entities/inspection.entity";
import { Question } from "../../questions/entities/question.entity";
import { StatusEnum } from "../../shared/enums/status.enum";

@Entity()
export class Answer {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: StatusEnum })
  status: StatusEnum;

  @Column("text")
  text: string;

  @Column("text", { nullable: true })
  picture: string | null;

  @ManyToOne(() => Inspection, (inspection) => inspection.answers, {
    onDelete: "CASCADE",
  })
  inspection: Inspection;

  @ManyToOne(() => Question, { onDelete: "CASCADE" })
  question: Question;
}
