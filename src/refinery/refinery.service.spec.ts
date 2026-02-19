import { Test, TestingModule } from "@nestjs/testing";
import { RefineryService } from "./refinery.service";

describe("RefineryService", () => {
  let service: RefineryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RefineryService],
    }).compile();

    service = module.get<RefineryService>(RefineryService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
