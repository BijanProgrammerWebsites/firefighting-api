import { Module } from "@nestjs/common";
import { RefineryService } from "./refinery.service";
import { RefineryController } from "./refinery.controller";

@Module({
  controllers: [RefineryController],
  providers: [RefineryService],
})
export class RefineryModule {}
