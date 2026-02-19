import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  ImATeapotException,
} from "@nestjs/common";

import { Response } from "express";

@Catch(ImATeapotException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ImATeapotException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const validationErrors = exception.getResponse() as any;

    if (!validationErrors) {
      response.status(status).json(exception.getResponse());
      return;
    }

    const formattedErrors = {};

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    validationErrors.message.forEach((error: string) => {
      const fieldMatch = error.match(/^([a-zA-Z0-9]+)/);

      const field = fieldMatch?.[0] ?? "unknown";

      if (!formattedErrors[field]) {
        formattedErrors[field] = [];
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      formattedErrors[field].push(error);
    });

    response.status(HttpStatus.BAD_REQUEST).json({
      error: "Validation Failed",
      message: "One or more conditions are not met.",
      validationErrors: formattedErrors,
    });
  }
}
