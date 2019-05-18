import { Test, TestingModule } from '@nestjs/testing';
import { GhostService } from './ghost.service';

describe('GhostService', () => {
  let service: GhostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GhostService],
    }).compile();

    service = module.get<GhostService>(GhostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
