import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTemplateDto } from "./dto/create-template.dto";
import { UpdateTemplateDto } from "./dto/update-template.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Template } from "./entities/template.entity";
import { Repository } from "typeorm";
import { Standard } from "../standards/entities/standard.entity";
import { ResponseDto } from "../shared/dto/response.dto";
import { assignDefinedValues } from "../shared/utils/object.utils";

@Injectable()
export class TemplatesService {
  public constructor(
    @InjectRepository(Template)
    private readonly templateRepo: Repository<Template>,
    @InjectRepository(Standard)
    private readonly standardRepo: Repository<Standard>,
  ) {}

  public async create(dto: CreateTemplateDto): Promise<ResponseDto<string>> {
    const standard = await this.standardRepo.findOne({
      where: { id: dto.standardId },
    });

    if (!standard) {
      throw new NotFoundException("Standard not found.");
    }

    const createdTemplate = await this.templateRepo.save({
      title: dto.title,
      description: dto.description,
      standard,
    });

    return {
      message: "Template created successfully.",
      result: createdTemplate.id,
    };
  }

  public async findAll(): Promise<ResponseDto<Template[]>> {
    const templates = await this.templateRepo.find({
      relations: ["standard"],
      order: { title: "ASC" },
    });

    return {
      message: "Templates found successfully.",
      result: templates,
    };
  }

  public async findOne(id: string): Promise<Template> {
    const template = await this.templateRepo.findOne({
      where: { id },
      relations: ["standard"],
    });

    if (!template) {
      throw new NotFoundException("Template not found.");
    }

    return template;
  }

  public async update(
    id: string,
    dto: UpdateTemplateDto,
  ): Promise<ResponseDto> {
    const template = await this.findOne(id);

    const updatedTemplate = assignDefinedValues(template, dto);
    await this.templateRepo.save(updatedTemplate);

    return { message: "Template updated successfully." };
  }

  public async remove(id: string): Promise<ResponseDto> {
    await this.templateRepo.delete(id);

    return { message: "Template removed successfully." };
  }
}
