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
        'userAddress1',
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
      when(mockGhostService.get(1)).thenReturn(new Promise((resolve) => {
        resolve(ghost);
      }));
      controller = new GhostController(instance(mockGhostService));

      expect(await controller.getById(1)).toBe(ghost);
    });
  });

  describe('#findOneByGene', () => {
    it('should find one ghost by gene', async () => {
      when(mockGhostService.getByGene('EE398A811')).thenReturn(new Promise((resolve) => {
        resolve(ghost);
      }));
      controller = new GhostController(instance(mockGhostService));

      expect(await controller.getByGene('EE398A811')).toBe(ghost);
    });
  });

  describe('#findAllByUser()', () => {
    it('should find ghosts by ID of user', async () => {
      when(mockGhostService.getByUser('user1')).thenReturn(new Promise((resolve) => {
        resolve([ghost]);
      }));
      controller = new GhostController(instance(mockGhostService));

      expect(await controller.getByUser('user1')).toEqual([ghost]);
    });
  });

  describe('#findAll()', () => {
    it('should find page 1 ghosts', async () => {

      when(mockGhostService.getByPage(1)).thenReturn(new Promise((resolve) => {
        resolve([ghost]);
      }));
      controller = new GhostController(instance(mockGhostService));

      expect(await controller.getByPage(1)).toEqual([ghost]);
    });
  });
});
