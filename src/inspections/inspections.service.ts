import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CreateInspectionDto } from "./dto/create-inspection.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Inspection } from "./entities/inspection.entity";
import { Repository } from "typeorm";
import { ResponseDto } from "../shared/dto/response.dto";
import { EquipmentsService } from "../equipments/equipments.service";
import { Answer } from "../answers/entities/answer.entity";
import { Question } from "../questions/entities/question.entity";
import { Defect } from "../defects/entities/defect.entity";
import { Equipment } from "../equipments/entities/equipment.entity";

@Injectable()
export class InspectionsService {
  public constructor(
    @InjectRepository(Inspection)
    private readonly inspectionRepo: Repository<Inspection>,
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
    @InjectRepository(Answer)
    private readonly answerRepo: Repository<Answer>,
    @InjectRepository(Defect)
    private readonly defectRepo: Repository<Defect>,
    @InjectRepository(Equipment)
    private readonly equipmentRepo: Repository<Equipment>,
    private readonly equipmentsService: EquipmentsService,
  ) {}

  public async create(dto: CreateInspectionDto): Promise<ResponseDto<string>> {
    const equipmentResponse = await this.equipmentsService.findOne(
      dto.equipmentId,
    );

    if ("error" in equipmentResponse) {
      throw new InternalServerErrorException(equipmentResponse.error);
    }

    const { result: equipment } = equipmentResponse;

    const inspection = this.inspectionRepo.create({
      equipment,
      answers: [],
    });

    for (const answerDto of dto.answers) {
      const question = await this.questionRepo.findOne({
        where: { id: answerDto.questionId },
      });

      if (!question) {
        throw new NotFoundException("سؤال پیدا نشد.");
      }

      const answer = this.answerRepo.create({
        text: answerDto.text,
        picture: answerDto.picture ?? null,
        question,
      });

      if (answerDto.severity) {
        answer.defect = this.defectRepo.create({
          severity: answerDto.severity,
          equipment,
        });
      }

      inspection.answers.push(answer);
    }

    const createdInspection = await this.inspectionRepo.save(inspection);

    equipment.status = inspection.status;
    await this.equipmentRepo.save(equipment);

    return {
      message: "بازرسی با موفقیت ایجاد شد.",
      result: createdInspection.id,
    };
  }

  public async findAll(): Promise<ResponseDto<Inspection[]>> {
    const inspections = await this.inspectionRepo.find({
      relations: ["equipment", "answers", "answers.question"],
      order: { createdDate: "DESC" },
    });

    return {
      message: "بازرسی‌ها با موفقیت دریافت شدند.",
      result: inspections,
    };
  }

  public async findOne(id: string): Promise<ResponseDto<Inspection>> {
    const inspection = await this.getInspectionOrFail(id);

    return {
      message: "بازرسی با موفقیت دریافت شد.",
      result: inspection,
    };
  }

  private async getInspectionOrFail(id: string): Promise<Inspection> {
    const inspection = await this.inspectionRepo.findOne({
      where: { id },
      relations: ["equipment", "answers", "answers.question"],
    });

    if (!inspection) {
      throw new NotFoundException("بازرسی پیدا نشد.");
    }

    return inspection;
  }
}
