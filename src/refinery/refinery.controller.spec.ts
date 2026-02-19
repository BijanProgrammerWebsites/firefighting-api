import { Test, TestingModule } from "@nestjs/testing";
import { RefineryController } from "./refinery.controller";
import { RefineryService } from "./refinery.service";

describe("RefineryController", () => {
  let controller: RefineryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RefineryController],
      providers: [RefineryService],
    }).compile();

    controller = module.get<RefineryController>(RefineryController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
