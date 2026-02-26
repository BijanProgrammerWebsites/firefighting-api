import { Injectable } from "@nestjs/common";
import { ResponseDto } from "./shared/dto/response.dto";

@Injectable()
export class AppService {
  public getHello(): ResponseDto<string> {
    return {
      message: "پیام با موفقیت دریافت شد.",
      result: "سلام، رفیق!",
    };
  }
}
