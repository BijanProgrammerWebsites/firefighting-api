import {
  ClassSerializerInterceptor,
  HttpStatus,
  ValidationPipe,
} from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";

import cookieParser from "cookie-parser";

import "reflect-metadata";

import { AppModule } from "./app.module";

import { ValidationExceptionFilter } from "./validation.filter";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(cookieParser());

  app.useStaticAssets(process.env.FILE_STORAGE_PATH!, { prefix: "/pictures" });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: HttpStatus.I_AM_A_TEAPOT,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalFilters(new ValidationExceptionFilter());

  await app.listen(process.env.PORT ?? 5000);
}

void bootstrap();
