import { NestFactory } from "@nestjs/core";
import { Logger, LogLevel } from "@nestjs/common";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

function getLogLevels(): LogLevel[] {
  const level = process.env.LOGGER_LEVEL || "info";

  switch (level) {
    case "debug":
      return ["log", "error", "warn", "debug"];
    case "verbose":
      return ["log", "error", "warn", "debug", "verbose"];
    case "info":
    default:
      return ["log", "error", "warn"];
  }
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { logger: getLogLevels() },
  );

  app.setGlobalPrefix("api");
  app.enableCors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Habit Tracker API")
    .setDescription("REST API for habits, check-ins, streaks, and milestones")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, document);

  const port = parseInt(process.env.PORT || "3000", 10);
  const logger = new Logger("Bootstrap");

  await app.listen(port, "0.0.0.0", () => {
    logger.debug(`Backend running on http://localhost:${port}`);
    logger.debug(`Swagger available on http://localhost:${port}/api`);
  });
}

bootstrap();
