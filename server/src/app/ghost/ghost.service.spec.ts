import {GhostService} from './ghost.service';
import {anything, instance, mock, objectContaining, when} from 'ts-mockito';
import {Ghost} from '../../domain/ghost/ghost.entity';
import {GhostRepository} from '../../port/persistence/repository/ghost.repository.impl';
import {IGhostRepository} from '../../domain/ghost/ghost.repository';
import {GhostDto} from './dto/ghost.dto';

describe('GhostService', () => {
  let service: GhostService;
  const mockGhost: Ghost = new Ghost(
    'FF9182839',
    1,
    'userId1',
  );
  const mockGhost2: Ghost = new Ghost(
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
      const repositoryImpl: GhostRepository = instance(repository);

      service = new GhostService(repositoryImpl);
      const ghost = await service.findAll(0);
      expect(ghost).toEqual([mockGhost, mockGhost2]);
    });
  });

  describe('#createEgg()', async () => {
    const repository: GhostRepository = mock(GhostRepository);
    let ghostDto: GhostDto;

    it('should create egg of ghost', async () => {
      const newGhost = new Ghost(
          'EB123F345',
          0,
          'userId3',
      );

      when(repository.findOne(3)).thenReturn(new Promise((res) => {
        res(newGhost);
      }));

      const repositoryImpl: IGhostRepository = instance(repository);

      ghostDto = new GhostDto('userId3', 'EB123F345');
      service = new GhostService(repositoryImpl);
      service.createEgg(ghostDto);

      const ghost = await service.findOne(3);
      expect(ghost).toEqual(newGhost);
    });
  });

  describe('#transfer()', async () => {
    const repository: GhostRepository = mock(GhostRepository);

    it('should transfer owner to receiver', async () => {
      when(repository.findOne(1)).thenReturn(new Promise((res) => {
        res(mockGhost2);
      }));

      const option = {
        gene: 'ABF938481',
      };

      when(repository.find(objectContaining(option))).thenReturn(new Promise((res) => {
        res([mockGhost2]);
      }));

      const repositoryImpl: IGhostRepository = instance(repository);

      service = new GhostService(repositoryImpl);
      service.transfer('userId1', 'userId2', 'ABF938481');

      const ghost = await service.findOne(1);
      expect(ghost.userId).toEqual('userId2');
    });
  });

  describe('#levelUp()', async () => {
    const repository: GhostRepository = mock(GhostRepository);

    it('should increase level of ghost', async () => {
      when(repository.findOne(1)).thenReturn(new Promise((res) => {
        res(mockGhost2);
      }));

      const option = {
        gene: 'ABF938481',
      };

      when(repository.find(objectContaining(option))).thenReturn(new Promise((res) => {
        res([mockGhost2]);
      }));

      const repositoryImpl: IGhostRepository = instance(repository);

      service = new GhostService(repositoryImpl);
      service.levelUp('ABF938481', 2);

      const ghost = await service.findOne(1);
      expect(ghost.level).toEqual(2);
    });
  });
});
