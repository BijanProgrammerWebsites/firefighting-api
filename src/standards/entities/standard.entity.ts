import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Question } from "../../questions/entities/question.entity";
import { Transform } from "class-transformer";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Standard {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  title: string;

  @OneToMany(() => Question, (question) => question.standard)
  questions: Question[];

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToOne(() => User, { nullable: true })
  @Transform(({ value }) => (value ? value.username : null))
  createdBy: User | null;

  @ManyToOne(() => User, { nullable: true })
  @Transform(({ value }) => (value ? value.username : null))
  updatedBy: User | null;
}
