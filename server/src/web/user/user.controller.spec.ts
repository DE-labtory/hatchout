import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import {instance, mock, when} from 'ts-mockito';
import {UserService} from '../../app/user/user.service';
import {UserServiceImpl} from '../../app/user/user.service.impl';
import {User} from '../../domain/user/user.entity';
import {UserDto} from '../../domain/user/dto/user.dto';

describe('User Controller', () => {
  const mockUserService = mock(UserServiceImpl);
  const address = 'testAddress';
  const name = 'name';
  let user: User;
  let controller: UserController;

  beforeEach(() => {
    user = new User(address, name);
  });

  describe('dependency resolve', () => {
    it('should be defined', async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [
          UserController,
        ],
        providers: [
          {
            provide: 'UserService',
            useValue: instance(mockUserService),
          },
        ],
      }).compile();

      controller = module.get<UserController>(UserController);
      expect(controller).toBeDefined();
    });
  });
  describe('#get()', () => {
    const id = 1;

    it('should return user', async () => {
      when(mockUserService.get(id)).thenReturn(new Promise((resolve) => {
        resolve(user);
      }));
      controller = new UserController(instance(mockUserService));

      expect(await controller.get(id)).toBe(user);

    });
    it('should return undefined', async () => {
      when(mockUserService.get(id)).thenReturn(new Promise((resolve) => resolve(undefined)));
      controller = new UserController(instance(mockUserService));

      expect(await controller.get(id)).toBe(undefined);
    });
  });
  describe('#create()', () => {
    let userDto: UserDto;

    it('should return user', async () => {
      userDto = new UserDto(address, name);
      when(mockUserService.create(userDto)).thenReturn(new Promise((resolve => {
        resolve(user);
      })));
      controller = new UserController(instance(mockUserService));

      expect(await controller.create(userDto)).toBe(user);

    });
    it('should return undefined', async () => {
      userDto = new UserDto();
      when(mockUserService.create(userDto)).thenReturn(new Promise(((resolve) => resolve(undefined))));
      controller = new UserController(instance(mockUserService));

      expect(await controller.create(userDto)).toBe(undefined);
    });
  });
  describe('#delete()', () => {
    const id = 1;

    it('should return undefined', async () => {
      when(mockUserService.delete(id)).thenReturn(new Promise((resolve => resolve(undefined))));
      controller = new UserController(instance(mockUserService));

      expect(await controller.delete(id)).toBe(undefined);
    });
  });
  describe('#increaseLevel()', () => {
    const id = 1;
    const amount = 10;

    it('should return user', async () => {
      when(mockUserService.increaseLevel(id, amount)).thenReturn(new Promise((resolve => resolve(user))));
      controller = new UserController(instance(mockUserService));

      expect(await controller.increaseLevel(id, amount)).toBe(user);
    });
    it('should return undefined', async () => {
      when(mockUserService.increaseLevel(id, amount)).thenReturn(undefined);
      controller = new UserController(instance(mockUserService));

      expect(await controller.increaseLevel(id, amount)).toBe(undefined);
    });
  });
});
