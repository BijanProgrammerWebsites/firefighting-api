import { Test, TestingModule } from "@nestjs/testing";
import { StandardsService } from "./standards.service";

describe("StandardService", () => {
  let service: StandardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StandardsService],
    }).compile();

    service = module.get<StandardsService>(StandardsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
