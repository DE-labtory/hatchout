import { Test, TestingModule } from '@nestjs/testing';
import { GhostController } from './ghost.controller';

describe('Ghost Controller', () => {
  let controller: GhostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GhostController],
    }).compile();

    controller = module.get<GhostController>(GhostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
