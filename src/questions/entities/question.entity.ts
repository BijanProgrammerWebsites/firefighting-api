import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Standard } from "../../standards/entities/standard.entity";

@Entity()
export class Question {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  text: string;

  @ManyToOne(() => Standard, (standard) => standard.questions)
  standard: Standard;
}
