import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

import { Answer } from "../../answers/entities/answer.entity";
import { Equipment } from "../../equipments/entities/equipment.entity";
import { Inspection } from "../../inspections/entities/inspection.entity";
import { Question } from "../../questions/entities/question.entity";
import { Refinery } from "../../refinery/entities/refinery.entity";
import { Site } from "../../sites/entities/site.entity";
import { Standard } from "../../standards/entities/standard.entity";
import { Template } from "../../templates/entities/template.entity";
import { Unit } from "../../units/entities/unit.entity";
import { Zone } from "../../zones/entities/zone.entity";
import { Status } from "../../shared/enums/status.enum";

export class ResourcesSeeder implements Seeder {
  track = true;

  async run(dataSource: DataSource) {
    const answerRepo = dataSource.getRepository(Answer);
    const inspectionRepo = dataSource.getRepository(Inspection);
    const equipmentRepo = dataSource.getRepository(Equipment);
    const unitRepo = dataSource.getRepository(Unit);
    const zoneRepo = dataSource.getRepository(Zone);
    const siteRepo = dataSource.getRepository(Site);
    const refineryRepo = dataSource.getRepository(Refinery);

    const templateRepo = dataSource.getRepository(Template);
    const questionRepo = dataSource.getRepository(Question);
    const standardRepo = dataSource.getRepository(Standard);

    // --- Standards, templates, questions ---
    const standards = await standardRepo.save([
      { title: "کپسول‌های آتش‌نشانی" },
      { title: "هیدرانت‌ها و قرقره‌های شیلنگ" },
      { title: "خروجی‌های اضطراری و علائم" },
    ]);

    const [extinguishersStd, hydrantsStd, exitsStd] = standards;

    const extinguisherQuestions = await questionRepo.save([
      {
        text: "آیا کپسول به‌درستی نصب شده و به‌خوبی قابل‌مشاهده است؟",
        standard: extinguishersStd,
      },
      {
        text: "آیا فشارسنج در محدوده سبز قرار دارد؟",
        standard: extinguishersStd,
      },
      {
        text: "آیا برچسب بازرسی به‌روز است؟",
        standard: extinguishersStd,
      },
    ]);

    const hydrantQuestions = await questionRepo.save([
      {
        text: "آیا هیدرانت در دسترس و بدون مانع است؟",
        standard: hydrantsStd,
      },
      {
        text: "آیا قرقره شیلنگ در وضعیت مناسبی قرار دارد؟",
        standard: hydrantsStd,
      },
    ]);

    const exitQuestions = await questionRepo.save([
      {
        text: "آیا خروجی‌های اضطراری به‌طور واضح مشخص شده‌اند؟",
        standard: exitsStd,
      },
      {
        text: "آیا مسیرهای خروجی بدون مانع هستند؟",
        standard: exitsStd,
      },
    ]);

    const templates = await templateRepo.save([
      {
        title: "بازرسی ماهانه کپسول آتش‌نشانی",
        description: "چک‌لیست استاندارد برای کپسول‌های قابل‌حمل آتش‌نشانی.",
        standard: extinguishersStd,
      },
      {
        title: "بازرسی فصلی هیدرانت",
        description: "چک‌لیست برای هیدرانت‌ها و قرقره‌های شیلنگ.",
        standard: hydrantsStd,
      },
      {
        title: "بازدید خروجی‌های اضطراری",
        description: "چک‌لیست برای خروجی‌ها، روشنایی و علائم ایمنی.",
        standard: exitsStd,
      },
    ]);

    const [extinguisherTpl, hydrantTpl, exitsTpl] = templates;

    // --- Refinery hierarchy: refinery -> sites -> zones -> units ---
    const refinery = await refineryRepo.save({
      title: "پالایشگاه اصلی",
      picture: null,
    });

    const sites = await siteRepo.save([
      { position: 1, title: "سایت شمالی", refinery },
      { position: 2, title: "سایت جنوبی", refinery },
    ]);

    const [northSite, southSite] = sites;

    const zones = await zoneRepo.save([
      { position: 1, title: "مخزن‌ها", site: northSite },
      { position: 2, title: "منطقه بارگیری", site: northSite },
      { position: 1, title: "منطقه فرایندی", site: southSite },
    ]);

    const [tankFarmZone, loadingZone, processZone] = zones;

    const units = await unitRepo.save([
      { position: 1, title: "واحد A1", zone: tankFarmZone },
      { position: 2, title: "واحد A2", zone: tankFarmZone },
      { position: 1, title: "واحد B1", zone: loadingZone },
      { position: 1, title: "واحد C1", zone: processZone },
    ]);

    const [unitA1, unitA2, unitB1, unitC1] = units;

    // --- Equipments linked to templates and units ---
    const equipments = await equipmentRepo.save([
      {
        position: 1,
        title: "کپسول EF-001",
        template: extinguisherTpl,
        unit: unitA1,
      },
      {
        position: 2,
        title: "کپسول EF-002",
        template: extinguisherTpl,
        unit: unitA2,
      },
      {
        position: 1,
        title: "هیدرانت HY-010",
        template: hydrantTpl,
        unit: unitB1,
      },
      {
        position: 1,
        title: "درِ خروج EX-01",
        template: exitsTpl,
        unit: unitC1,
      },
    ]);

    // --- Inspections + answers with varied statuses ---
    for (const equipment of equipments) {
      const inspection = await inspectionRepo.save({ equipment });

      let relatedQuestions: Question[];
      switch (equipment.template.id) {
        case extinguisherTpl.id:
          relatedQuestions = extinguisherQuestions;
          break;
        case hydrantTpl.id:
          relatedQuestions = hydrantQuestions;
          break;
        case exitsTpl.id:
          relatedQuestions = exitQuestions;
          break;
        default:
          relatedQuestions = [];
      }

      const answersPayload = relatedQuestions.map((question, index) => {
        const status =
          index === 0 ? Status.OK : index === 1 ? Status.WARNING : Status.ERROR;

        return {
          status,
          text:
            status === Status.OK
              ? "مطابق استاندارد"
              : status === Status.WARNING
                ? "ایراد جزئی شناسایی شد"
                : "عدم انطباق؛ نیازمند اقدام اصلاحی است",
          picture: null,
          inspection,
          question,
        };
      });

      if (answersPayload.length) {
        await answerRepo.save(answersPayload);
      }
    }
  }
}
