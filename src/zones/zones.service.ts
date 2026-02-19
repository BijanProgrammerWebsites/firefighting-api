import { Injectable } from "@nestjs/common";
import { CreateZoneDto } from "./dto/create-zone.dto";
import { UpdateZoneDto } from "./dto/update-zone.dto";
import { ResponseDto } from "../shared/dto/response.dto";

@Injectable()
export class ZonesService {
  public async create(dto: CreateZoneDto): Promise<ResponseDto> {
    return { message: "This action adds a new zone" };
  }

  public async findAll(): Promise<ResponseDto> {
    return { message: `This action returns all zones` };
  }

  public async findOne(id: number): Promise<ResponseDto> {
    return { message: `This action returns a #${id} zone` };
  }

  public async update(id: number, dto: UpdateZoneDto): Promise<ResponseDto> {
    return { message: `This action updates a #${id} zone` };
  }

  public async remove(id: number): Promise<ResponseDto> {
    return { message: `This action removes a #${id} zone` };
  }
}
