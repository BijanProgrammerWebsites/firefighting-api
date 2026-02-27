import {
  ClassSerializerInterceptor,
  HttpStatus,
  ValidationPipe,
} from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import cookieParser from "cookie-parser";

import "reflect-metadata";

import { AppModule } from "./app.module";

import { ValidationExceptionFilter } from "./validation.filter";

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
      forbidUnknownValues: true,
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalFilters(new ValidationExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle("Firefighting API")
    .setVersion("1.0")
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, documentFactory, {
    customSiteTitle: "Firefighting API",
  });

  await app.listen(process.env.PORT ?? 5000);
}

void bootstrap();
