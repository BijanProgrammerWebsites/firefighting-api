import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TemplatesService } from "./templates.service";
import { TemplatesController } from "./templates.controller";
import { Template } from "./entities/template.entity";
import { Standard } from "../standards/entities/standard.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Template, Standard])],
  controllers: [TemplatesController],
  providers: [TemplatesService],
  exports: [TypeOrmModule],
})
export class TemplatesModule {}
