import { Test, TestingModule } from '@nestjs/testing';
import { GhostController } from './ghost.controller';
import {instance, mock, when} from 'ts-mockito';
import {GhostService} from '../../app/ghost/ghost.service';
import {Ghost} from '../../domain/ghost/ghost.entity';

describe('Ghost Controller', () => {
  const mockGhostService: GhostService = mock(GhostService);
  let ghost: Ghost;
  let controller: GhostController;

  beforeEach(() => {
    ghost = new Ghost(
        'EE398A811',
        1,
        0,
        'user1',
    );
  });

  describe('dependency resolve', () => {
    it('should be defined', async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [GhostController],
        providers: [{
          provide: 'GhostService',
          useValue: instance(mockGhostService),
        }],
      }).compile();

      controller = module.get<GhostController>(GhostController);
      expect(controller).toBeDefined();
    });
  });

  describe('#findOne()', () => {
    it('should find one ghost', async () => {
      when(mockGhostService.findOne(1)).thenReturn(new Promise((resolve) => {
        resolve(ghost);
      }));
      controller = new GhostController(instance(mockGhostService));

      expect(await controller.findOne(1)).toBe(ghost);
    });
  });

  describe('#findOneByGene', () => {
    it('should find one ghost by gene', async () => {
      when(mockGhostService.findOneByGene('EE398A811')).thenReturn(new Promise((resolve) => {
        resolve(ghost);
      }));
      controller = new GhostController(instance(mockGhostService));

      expect(await controller.findOneByGene('EE398A811')).toBe(ghost);
    });
  });

  describe('#findAllByUser()', () => {
    it('should find ghosts by ID of user', async () => {
      when(mockGhostService.findAllByUser('user1')).thenReturn(new Promise((resolve) => {
        resolve([ghost]);
      }));
      controller = new GhostController(instance(mockGhostService));

      expect(await controller.findAllByUser('user1')).toEqual([ghost]);
    });
  });

  describe('#findAll()', () => {
    it('should find page 1 ghosts', async () => {

      when(mockGhostService.findAll(1)).thenReturn(new Promise((resolve) => {
        resolve([ghost]);
      }));
      controller = new GhostController(instance(mockGhostService));

      expect(await controller.findAll(1)).toEqual([ghost]);
    });
  });
});
