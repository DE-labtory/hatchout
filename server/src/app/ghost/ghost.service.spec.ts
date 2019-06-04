import {GhostService} from './ghost.service';
import {anything, instance, mock, objectContaining, when} from 'ts-mockito';
import {Ghost} from '../../domain/ghost/ghost.entity';
import {IGhostRepository} from '../../domain/ghost/ghost.repository';
import {GhostRepository} from '../../port/persistence/repository/ghost.repository.impl';

describe('GhostService', () => {
  let service: GhostService;
  const mockGhost: Ghost = new Ghost(
    1,
    'FF9182839',
    1,
    'userId1',
  );
  const mockGhost2: Ghost = new Ghost(
    2,
    'ABF938481',
    1,
    'userId2',
  );

  describe('#findOne()', async () => {
    const repository: GhostRepository = mock(GhostRepository);

    it('should find one ghost', async () => {
      when(repository.findOne(1)).thenReturn(new Promise((res) => {
        res(mockGhost);
      }));
      const repositoryImpl: IGhostRepository = instance(repository);

      service = new GhostService(repositoryImpl);
      const ghost = await service.findOne(1);
      expect(ghost).toEqual(mockGhost);
    });
  });

  describe('#findAllByUser()', async () => {
    const repository: GhostRepository = mock(GhostRepository);

    it('should find ghosts by userid', async () => {
      when(repository.find(anything())).thenReturn(new Promise((res) => {
        res([mockGhost]);
      }));
      const repositoryImpl: IGhostRepository = instance(repository);

      service = new GhostService(repositoryImpl);
      const ghosts: Ghost[] = await service.findAllByUser(mockGhost.userId);
      expect(ghosts).toEqual([mockGhost]);
    });
  });

  describe('#findAll()', async () => {
    const repository: GhostRepository = mock(GhostRepository);

    it('should find page 1 ghosts', async () => {
      const option = {
        take: 25,
        skip: 0,
      };

      when(repository.find(objectContaining(option))).thenReturn(new Promise((res) => {
        res([mockGhost, mockGhost2]);
      }));
      const repositoryImpl: IGhostRepository = instance(repository);

      service = new GhostService(repositoryImpl);
      const ghost = await service.findAll(1);
      expect(ghost).toEqual([mockGhost, mockGhost2]);
    });

    it('should find page 1 ghosts when page number is less then 1', async () => {
      const option = {
        take: 25,
        skip: 0,
      };

      when(repository.find(objectContaining(option))).thenReturn(new Promise((res) => {
        res([mockGhost, mockGhost2]);
      }));
      const repositoryImpl: IGhostRepository = instance(repository);

      service = new GhostService(repositoryImpl);
      const ghost = await service.findAll(0);
      expect(ghost).toEqual([mockGhost, mockGhost2]);
    });
  });
});
