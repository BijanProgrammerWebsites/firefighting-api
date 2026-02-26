import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
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

  @ManyToOne(() => Standard)
  standard: Standard;

  @OneToMany(() => Equipment, (equipment) => equipment.template)
  equipments: Equipment[];
}
