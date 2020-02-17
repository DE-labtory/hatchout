import { Test, TestingModule } from '@nestjs/testing';
import { GhostController } from './ghost.controller';
import {instance, mock, when} from 'ts-mockito';
import {Ghost} from '../../domain/ghost/ghost.entity';
import {GhostService} from '../../app/ghost/ghost.service';
import {GhostServiceImpl} from '../../app/ghost/ghost.service.impl';

describe('Ghost Controller', () => {
  const mockGhostService: GhostService = mock<GhostService>();
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
          useValue: instance(mock(GhostServiceImpl)),
        }],
      }).compile();

      controller = module.get<GhostController>(GhostController);
      expect(controller).toBeDefined();
    });
  });

  describe('#getById()', () => {
    it('should return ghost', async () => {
      const id: number = 1;
      when(mockGhostService.getById(id)).thenReturn(new Promise((resolve) => {
        resolve(ghost);
      }));
      controller = new GhostController(instance(mockGhostService));

      expect(await controller.getById(id)).toBe(ghost);
    });
  });

  describe('#get()', () => {
    it('should return ghost with gene parameter', async () => {
      const gene: string = 'EE398A811';
      when(mockGhostService.getByGene(gene)).thenReturn(new Promise((resolve) => {
        resolve(ghost);
      }));
      controller = new GhostController(instance(mockGhostService));

      expect(await controller.get(gene, undefined, undefined)).toEqual([ghost]);
    });
    it('should return ghosts with userId', async () => {
      const userId: string = 'user1';
      when(mockGhostService.getByUser(userId)).thenReturn(new Promise((resolve) => {
        resolve([ghost]);
      }));
      controller = new GhostController(instance(mockGhostService));

      expect(await controller.get(undefined, userId, undefined)).toEqual([ghost]);
    });
    it('should return ghosts with page', async () => {

      const page: number = 1;
      when(mockGhostService.getByPage(page)).thenReturn(new Promise((resolve) => {
        resolve([ghost]);
      }));
      controller = new GhostController(instance(mockGhostService));

      expect(await controller.get(undefined, undefined, page)).toEqual([ghost]);
    });
  });
});
