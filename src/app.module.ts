import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { AuthModule } from "./auth/auth.module";

import { User } from "./users/entities/user.entity";
import { UsersModule } from "./users/users.module";
import { RefineryModule } from "./refinery/refinery.module";
import { SitesModule } from "./sites/sites.module";
import { ZonesModule } from "./zones/zones.module";
import { UnitsModule } from "./units/units.module";
import { EquipmentsModule } from "./equipments/equipments.module";
import { Refinery } from "./refinery/entities/refinery.entity";
import { Equipment } from "./equipments/entities/equipment.entity";
import { Site } from "./sites/entities/site.entity";
import { Zone } from "./zones/entities/zone.entity";
import { Unit } from "./units/entities/unit.entity";
import { StandardsModule } from "./standards/standards.module";
import { TemplatesModule } from "./templates/templates.module";
import { InspectionsModule } from "./inspections/inspections.module";
import { AnswersModule } from "./answers/answers.module";
import { QuestionsModule } from "./questions/questions.module";
import { Standard } from "./standards/entities/standard.entity";
import { Template } from "./templates/entities/template.entity";
import { Question } from "./questions/entities/question.entity";
import { Inspection } from "./inspections/entities/inspection.entity";
import { Answer } from "./answers/entities/answer.entity";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DATABASE_HOST!,
      port: parseInt(process.env.DATABASE_PORT!),
      username: process.env.DATABASE_USERNAME!,
      password: process.env.DATABASE_PASSWORD!,
      database: process.env.DATABASE_DATABASE!,
      entities: [
        Answer,
        Equipment,
        Inspection,
        Question,
        Refinery,
        Site,
        Standard,
        Template,
        Unit,
        User,
        Zone,
      ],
      synchronize: true,
    }),
    AuthModule,
    AnswersModule,
    EquipmentsModule,
    InspectionsModule,
    QuestionsModule,
    RefineryModule,
    SitesModule,
    StandardsModule,
    TemplatesModule,
    UnitsModule,
    UsersModule,
    ZonesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
