import {GhostService} from './ghost.service';
import {anything, instance, mock, when} from 'ts-mockito';
import {Ghost} from '../../domain/ghost/ghost.entity';
import {GhostRepository} from '../../port/persistence/repository/ghost.repository.impl';
import {UserRepository} from '../../port/persistence/repository/user.repository.impl';
import {NotFoundException} from '@nestjs/common';
import {ValidationException} from '../../domain/exception/ValidationException';
import {User} from '../../domain/user/user.entity';

describe('GhostService', () => {

  let service: GhostService;
  let mockGhost1: Ghost;
  let mockGhost2: Ghost;
  const mockGhostRepository: GhostRepository = mock(GhostRepository);
  const mockUserRepository: UserRepository = mock(UserRepository);

  beforeEach(() => {
    mockGhost1 = new Ghost(
      'FF9182839',
      1,
      'userAddress1',
    );
    mockGhost2 = new Ghost(
      'ABF938481',
      2,
      'userAddress2',
    );
  });

  describe('#get()', async () => {

    it('should return ghost', async () => {
      when(mockGhostRepository.findById(1)).thenReturn(new Promise((res) => {
        res(mockGhost1);
      }));

      service = new GhostService(instance(mockGhostRepository), instance(mockUserRepository));
      expect(await service.get(1)).toEqual(mockGhost1);
    });
    it('should throw NotFoundException', async () => {
      when(mockGhostRepository.findById(1)).thenReturn(undefined);
      service = new GhostService(instance(mockGhostRepository), instance(mockUserRepository));

      await expect(service.get(1))
        .rejects
        .toThrowError(NotFoundException);
    });
  });

  describe('#getByGene()', async () => {

    it('should return ghost', async () => {
      when(mockGhostRepository.findByGene(mockGhost1.getGene())).thenReturn(new Promise((res) => {
        res(mockGhost1);
      }));
      service = new GhostService(instance(mockGhostRepository), instance(mockUserRepository));

      expect(await service.getByGene('FF9182839')).toEqual(mockGhost1);
    });
    it('should throw NotFoundException', async () => {
      when(mockGhostRepository.findByGene('wrongGene')).thenReturn(undefined);
      service = new GhostService(instance(mockGhostRepository), instance(mockUserRepository));

      await expect(service.getByGene('wrongGene'))
        .rejects
        .toThrowError(NotFoundException);
    });

  });

  describe('#getByUser()', async () => {

    it('should return ghosts', async () => {
      when(mockGhostRepository.findByUserAddress(mockGhost1.getUserAddress())).thenReturn(new Promise((res) => {
        res([mockGhost1]);
      }));

      service = new GhostService(instance(mockGhostRepository), instance(mockUserRepository));
      const ghosts: Ghost[] = await service.getByUser(mockGhost1.getUserAddress());
      expect(ghosts).toEqual([mockGhost1]);
    });
    it('should throw NotFoundException', async () => {
      // todo: check if repository give [] when it doesn't find at all
      when(mockGhostRepository.findByUserAddress('wrongUserAddress')).thenReturn(new Promise((res) => {
        res([]);
      }));

      await expect(service.getByUser('wrongUserAddress'))
        .rejects
        .toThrowError(NotFoundException);
    });
  });

  describe('#getByPage()', async () => {

    it('should find page 1 ghosts', async () => {
      when(mockGhostRepository.findByPage(1)).thenReturn(new Promise((res) => {
        res([mockGhost1, mockGhost2]);
      }));
      service = new GhostService(instance(mockGhostRepository), instance(mockUserRepository));

      expect(await service.getByPage(1)).toEqual([mockGhost1, mockGhost2]);
    });

    it('should find page 1 ghosts when page number is less then 1', async () => {
      service = new GhostService(instance(mockGhostRepository), instance(mockUserRepository));
      await expect(service.getByPage(0))
        .rejects
        .toThrowError(ValidationException);
    });
  });

  describe('#createEgg()', () => {
    it('should return ghost', async () => {
      when(mockGhostRepository.findByGene(anything())).thenResolve(undefined);
      when(mockGhostRepository.save(anything())).thenResolve(mockGhost1);
      service = new GhostService(instance(mockGhostRepository), instance(mockUserRepository));

      expect(await service.createEgg(mockGhost1.getGene(), mockGhost1.getTokenId(), mockGhost1.getUserAddress()))
        .toBe(mockGhost1);
    });
    it('should throw ValidationException', async () => {
      when(mockGhostRepository.findByGene(anything())).thenResolve(mockGhost1);
      service = new GhostService(instance(mockGhostRepository), instance(mockUserRepository));

      await expect(service.createEgg(mockGhost1.getGene(), mockGhost1.tokenId, mockGhost1.getUserAddress()))
        .rejects
        .toThrowError(ValidationException);
    });
  });

  describe('#transfer()', async () => {
    const exUser: User = new User('userAddress1', 'userName1');
    const newUser: User = new User('userAddress2', 'userName2');
    it('should return ghost with changed userAddress', async () => {
      when(mockUserRepository.findByAddress(exUser.getAddress())).thenResolve(exUser);
      when(mockGhostRepository.findByUserAddress(exUser.getAddress())).thenResolve([mockGhost1]);
      when(mockUserRepository.findByAddress(newUser.getAddress())).thenResolve(newUser);
      when(mockGhostRepository.findByGene(mockGhost1.getGene())).thenResolve(mockGhost1);
      when(mockGhostRepository.save(anything())).thenCall((g) => g);

      service = new GhostService(instance(mockGhostRepository), instance(mockUserRepository));
      const ghost = await service.transfer(exUser.getAddress(), newUser.getAddress(), mockGhost1.getGene());
      expect(ghost.getUserAddress()).toBe(newUser.getAddress());
    });
    it('should throw NotFoundException', async () => {
      when(mockUserRepository.findByAddress(exUser.getAddress())).thenResolve(undefined);
      service = new GhostService(instance(mockGhostRepository), instance(mockUserRepository));

      await expect(service.transfer(exUser.getAddress(), newUser.getAddress(), mockGhost1.getGene()))
        .rejects
        .toThrowError(NotFoundException);
    });
    it('should throw ValidationException', async () => {
      when(mockUserRepository.findByAddress(exUser.getAddress())).thenResolve(exUser);
      when(mockGhostRepository.findByUserAddress(exUser.getAddress())).thenResolve([]);
      service = new GhostService(instance(mockGhostRepository), instance(mockUserRepository));

      await expect(service.transfer(exUser.getAddress(), newUser.getAddress(), mockGhost1.getGene()))
        .rejects
        .toThrowError(ValidationException);
    });
  });

  describe('#increaseLevel()', async () => {
    const amount = 10;
    it('should return ghost with increased level', async () => {
      when(mockGhostRepository.findByGene(mockGhost1.getGene())).thenResolve(mockGhost1);
      when(mockGhostRepository.save(anything())).thenCall((g) => g);
      service = new GhostService(instance(mockGhostRepository), instance(mockUserRepository));
      const exLevel = mockGhost1.getLevel();

      const ghost = await service.increaseLevel(mockGhost1.getGene(), amount);
      expect(ghost.getLevel()).toBe(exLevel + amount);
    });
  });
});
