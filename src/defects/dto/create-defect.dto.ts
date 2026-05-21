import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Trim } from "../../shared/decorators/trim.decorator";
import { DefectSeverityEnum } from "../../shared/enums/defect-severity.enum";
import { DefectStatusEnum } from "../../shared/enums/defect-status.enum";
import { MaintenanceStatusEnum } from "../../shared/enums/maintenance-status.enum";

export class CreateDefectDto {
  @IsString()
  @Trim()
  @IsNotEmpty()
  title: string;

  @IsString()
  @Trim()
  @IsNotEmpty()
  description: string;

  @IsEnum(DefectSeverityEnum)
  severity: DefectSeverityEnum;

  @IsEnum(DefectStatusEnum)
  status: DefectStatusEnum;

  @IsEnum(MaintenanceStatusEnum)
  maintenanceStatus: MaintenanceStatusEnum;
}
