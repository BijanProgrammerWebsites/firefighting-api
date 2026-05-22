import { Module } from "@nestjs/common";
import { DefectsService } from "./defects.service";
import { DefectsController } from "./defects.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Defect } from "./entities/defect.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Defect])],
  controllers: [DefectsController],
  providers: [DefectsService],
  exports: [TypeOrmModule, DefectsService],
})
export class DefectsModule {}
