import { Injectable } from "@nestjs/common";
import { CreateUnitDto } from "./dto/create-unit.dto";
import { UpdateUnitDto } from "./dto/update-unit.dto";
import { ResponseDto } from "../shared/dto/response.dto";

@Injectable()
export class UnitsService {
  public async create(dto: CreateUnitDto): Promise<ResponseDto> {
    return { message: "This action adds a new unit" };
  }

  public async findAll(): Promise<ResponseDto> {
    return { message: `This action returns all units` };
  }

  public async findOne(id: number): Promise<ResponseDto> {
    return { message: `This action returns a #${id} unit` };
  }

  public async update(id: number, dto: UpdateUnitDto): Promise<ResponseDto> {
    return { message: `This action updates a #${id} unit` };
  }

  public async remove(id: number): Promise<ResponseDto> {
    return { message: `This action removes a #${id} unit` };
  }
}
