import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from "typeorm";
import { Standard } from "../../standards/entities/standard.entity";
import { Equipment } from "../../equipments/entities/equipment.entity";

@Entity()
export class Template {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  title: string;

  @Column("text")
  description: string;

  @Column({ type: "int", default: 30 })
  inspectionPeriod: number;

  @ManyToOne(() => Standard)
  standard: Standard;

  @RelationId((template: Template) => template.standard)
  standardId: string;

  @OneToMany(() => Equipment, (equipment) => equipment.template)
  equipments: Equipment[];
}
