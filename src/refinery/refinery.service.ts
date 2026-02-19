import { Injectable } from "@nestjs/common";
import { CreateRefineryDto } from "./dto/create-refinery.dto";
import { UpdateRefineryDto } from "./dto/update-refinery.dto";

@Injectable()
export class RefineryService {
  create(createRefineryDto: CreateRefineryDto) {
    return "This action adds a new refinery";
  }

  findAll() {
    return `This action returns all refinery`;
  }

  findOne(id: number) {
    return `This action returns a #${id} refinery`;
  }

  update(id: number, updateRefineryDto: UpdateRefineryDto) {
    return `This action updates a #${id} refinery`;
  }

  remove(id: number) {
    return `This action removes a #${id} refinery`;
  }
}
