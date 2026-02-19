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

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DATABASE_HOST!,
      port: parseInt(process.env.DATABASE_PORT!),
      username: process.env.DATABASE_USERNAME!,
      password: process.env.DATABASE_PASSWORD!,
      database: process.env.DATABASE_DATABASE!,
      entities: [User, Refinery, Site, Zone, Unit, Equipment],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    RefineryModule,
    SitesModule,
    ZonesModule,
    UnitsModule,
    EquipmentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
