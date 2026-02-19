import { Injectable } from "@nestjs/common";
import { CreateEquipmentDto } from "./dto/create-equipment.dto";
import { UpdateEquipmentDto } from "./dto/update-equipment.dto";
import { ResponseDto } from "../shared/dto/response.dto";

@Injectable()
export class EquipmentsService {
  public async create(dto: CreateEquipmentDto): Promise<ResponseDto> {
    return { message: "This action adds a new equipment" };
  }

  public async findAll(): Promise<ResponseDto> {
    return { message: `This action returns all equipments` };
  }

  public async findOne(id: number): Promise<ResponseDto> {
    return { message: `This action returns a #${id} equipment` };
  }

  public async update(
    id: number,
    dto: UpdateEquipmentDto,
  ): Promise<ResponseDto> {
    return { message: `This action updates a #${id} equipment` };
  }

  public async remove(id: number): Promise<ResponseDto> {
    return { message: `This action removes a #${id} equipment` };
  }
}
