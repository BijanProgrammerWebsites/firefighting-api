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
        title: "آیا کپسول به‌درستی نصب شده و به‌خوبی قابل‌مشاهده است؟",
        description: "بررسی نصب صحیح و قابل‌مشاهده بودن کپسول آتش‌نشانی.",
        standard: extinguishersStd,
      },
      {
        title: "آیا فشارسنج در محدوده سبز قرار دارد؟",
        description: "کنترل وضعیت فشار کپسول از طریق فشارسنج.",
        standard: extinguishersStd,
      },
      {
        title: "آیا برچسب بازرسی به‌روز است؟",
        description: "اطمینان از به‌روز بودن آخرین برچسب بازرسی روی کپسول.",
        standard: extinguishersStd,
      },
    ]);

    const hydrantQuestions = await questionRepo.save([
      {
        title: "آیا هیدرانت در دسترس و بدون مانع است؟",
        description: "بررسی دسترسی آسان به هیدرانت و نبود موانع فیزیکی.",
        standard: hydrantsStd,
      },
      {
        title: "آیا قرقره شیلنگ در وضعیت مناسبی قرار دارد؟",
        description: "ارزیابی وضعیت استقرار و آماده‌به‌کار بودن قرقره شیلنگ.",
        standard: hydrantsStd,
      },
    ]);

    const exitQuestions = await questionRepo.save([
      {
        title: "آیا خروجی‌های اضطراری به‌طور واضح مشخص شده‌اند؟",
        description: "بررسی وضوح علائم و نشانه‌های خروجی‌های اضطراری.",
        standard: exitsStd,
      },
      {
        title: "آیا مسیرهای خروجی بدون مانع هستند؟",
        description: "اطمینان از باز بودن و بدون مانع بودن مسیرهای خروج.",
        standard: exitsStd,
      },
    ]);

    const templates = await templateRepo.save([
      {
        title: "بازرسی ماهانه کپسول آتش‌نشانی",
        description: "چک‌لیست استاندارد برای کپسول‌های قابل‌حمل آتش‌نشانی.",
        inspectionPeriod: 30,
        standard: extinguishersStd,
      },
      {
        title: "بازرسی فصلی هیدرانت",
        description: "چک‌لیست برای هیدرانت‌ها و قرقره‌های شیلنگ.",
        inspectionPeriod: 90,
        standard: hydrantsStd,
      },
      {
        title: "بازدید خروجی‌های اضطراری",
        description: "چک‌لیست برای خروجی‌ها، روشنایی و علائم ایمنی.",
        inspectionPeriod: 30,
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
      {
        position: 2,
        title: "کپسول EF-003",
        template: extinguisherTpl,
        unit: unitB1,
      },
    ]);

    // --- Inspections + answers with varied statuses and buckets ---
    const now = new Date();
    const daysAgo = (days: number) =>
      new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    /**
     * We choose createdDate values so that, given each template's
     * inspectionPeriodDays, the next inspection falls into different
     * dashboard buckets:
     *
     * - EF-001 (30d period): lastInspection = now - 40d -> overdue
     * - EF-002 (30d period): lastInspection = now - 30d -> due today
     * - HY-010 (90d period): lastInspection = now - 85d -> due in 5d -> this week
     * - EX-01 (30d period): lastInspection = now - 20d -> due in 10d -> next week
     * - EF-003 (30d period): lastInspection = now -> due in 30d -> later
     */
    const inspectionCreatedDatesByTitle: Record<string, Date> = {
      "کپسول EF-001": daysAgo(40),
      "کپسول EF-002": daysAgo(30),
      "هیدرانت HY-010": daysAgo(85),
      "درِ خروج EX-01": daysAgo(20),
      "کپسول EF-003": now,
    };

    for (const equipment of equipments) {
      const createdDate = inspectionCreatedDatesByTitle[equipment.title] ?? now;

      // Prepare inspection; status/score will be computed from answers below
      const inspection = inspectionRepo.create({
        equipment,
        createdDate,
      });

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

      // Compute inspection status and normalized score (0–100) based on seeded answers
      let hasError = false;
      let hasWarning = false;
      let rawScore = 0;

      for (const answer of answersPayload) {
        if (answer.status === Status.ERROR) {
          hasError = true;
        } else if (answer.status === Status.WARNING) {
          hasWarning = true;
          rawScore += 0.5;
        } else if (answer.status === Status.OK) {
          rawScore += 1;
        }
      }

      const inspectionStatus = hasError
        ? Status.ERROR
        : hasWarning
          ? Status.WARNING
          : Status.OK;

      inspection.status = inspectionStatus;
      const maxScore = answersPayload.length;
      inspection.score = maxScore > 0 ? (rawScore / maxScore) * 100 : 0;

      await inspectionRepo.save(inspection);

      if (answersPayload.length) {
        await answerRepo.save(answersPayload);
      }
    }
  }
}
