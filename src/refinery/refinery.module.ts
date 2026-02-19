import { Module } from "@nestjs/common";
import { RefineryService } from "./refinery.service";
import { RefineryController } from "./refinery.controller";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import crypto from "node:crypto";
import { formatFilenamePrefix } from "../shared/utils/format.utils";
import path from "node:path";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Refinery } from "./entities/refinery.entity";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forFeature([Refinery]),
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        storage: diskStorage({
          destination: configService.get<string>("FILE_STORAGE_PATH"),
          filename: (_req, file, cb) => {
            const filename =
              formatFilenamePrefix(new Date()) + "-" + crypto.randomUUID();
            const fileExtension = path.extname(file.originalname);
            const filenameWithExtension = filename + fileExtension;

            cb(null, filenameWithExtension);
          },
        }),
        fileFilter: (_req, file, cb) => {
          const allowed = /\.(jpg|jpeg|png|webp)$/i;

          if (!file.originalname.match(allowed)) {
            return cb(new Error("Only image files are allowed."), false);
          }

          cb(null, true);
        },
        limits: { fileSize: 10 * 1024 * 1024 },
      }),
    }),
  ],
  controllers: [RefineryController],
  providers: [RefineryService],
  exports: [TypeOrmModule],
})
export class RefineryModule {}
