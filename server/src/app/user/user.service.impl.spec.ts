import {UserServiceImpl} from './user.service.impl';
import {anything, instance, mock, when} from 'ts-mockito';
import {TestingModule, Test} from '@nestjs/testing';
import {User} from '../../domain/user/user.entity';
import {UserDto} from './dto/user.dto';
import {UserRepository} from '../../port/persistence/repository/user.repository.impl';
import {BadRequestException} from '@nestjs/common';

describe('UserServiceImpl', () => {
    const address = 'testAddress';
    const name = 'testName';
    const mockRepository = mock(UserRepository);
    let user: User;
    let service: UserServiceImpl;

    beforeEach(() => {
        user = new User(address, name);
    });

    describe('dependency resolve', () => {
        it('should be defined', async () => {
            const module: TestingModule = await Test.createTestingModule({
                providers: [
                    UserServiceImpl,
                    {
                        provide: 'IUserRepository',
                        useValue: instance(mockRepository),
                    },
                ],
            }).compile();
            service = module.get<UserServiceImpl>(UserServiceImpl);

            expect(service).toBeDefined();
        });
    });
    describe('#get()', () => {
        let id: number;

        it('should return user', async () => {
            id = 1;
            when(mockRepository.findById(id)).thenReturn(new Promise((resolve) => {
                resolve(user);
            }));
            service = new UserServiceImpl(instance(mockRepository));

            expect(await service.get(id)).toBe(user);
        });
        it('should throw BadRequestException', async () => {
            when(mockRepository.findById(null)).thenReturn(undefined);
            service = new UserServiceImpl(instance(mockRepository));

            await expect(service.get(null))
                .rejects
                .toThrowError(BadRequestException);
        });
    });
    describe('#create()', () => {
        let userDto: UserDto;

        it('should return user', async () => {
            when(mockRepository.findByAddress(address)).thenReturn(undefined);
            when(mockRepository.save(anything())).thenReturn(new Promise((resolve) => {
                resolve(user);
            }));
            service = new UserServiceImpl(instance(mockRepository));
            userDto = new UserDto(address, name);

            expect(await service.create(userDto)).toBe(user);
        });
        it('should throw "address should be defined"', async () => {
            when(mockRepository.findByAddress(address)).thenReturn(
                new Promise((resolve => {resolve(user); }),
                ),
            );
            service = new UserServiceImpl(instance(mockRepository));
            userDto = new UserDto();

            await expect(service.create(userDto))
                .rejects
                .toThrowError('address should be defined');
        });
        it('should throw "name should be defined"', async () => {
            when(mockRepository.findByAddress(address)).thenReturn(
                new Promise((resolve => {resolve(user); }),
                ),
            );
            service = new UserServiceImpl(instance(mockRepository));
            userDto = new UserDto(address);

            await expect(service.create(userDto))
                .rejects
                .toThrowError('name should be defined');
        });
        it('should throw "address is already registered"', async () => {
            when(mockRepository.findByAddress(address)).thenReturn(
                new Promise((resolve => {resolve(user); }),
                ),
            );
            service = new UserServiceImpl(instance(mockRepository));
            userDto = new UserDto(address, name);

            await expect(service.create(userDto))
                .rejects
                .toThrowError('address is already registered');
        });
    });
    describe('#delete()', () => {
        let id: number;

        it('should return undefined with valid id', async () =>  {
            id = 1;
            when(mockRepository.delete(id)).thenReturn(undefined);
            service = new UserServiceImpl(instance(mockRepository));

            expect(await service.delete(id)).toBeUndefined();
        });
        it('should return undefined with invalid id', async () => {
            when(mockRepository.delete(null)).thenReturn(undefined);
            service = new UserServiceImpl(instance(mockRepository));

            expect(await service.delete(null)).toBeUndefined();
        });
    });
    describe('#increasePoint()', () => {
        const id = 1;
        const amount = 10;

        it('should return user with increased point', async () => {
            when(mockRepository.findById(id)).thenReturn(new Promise((resolve => resolve(user))));
            service = new UserServiceImpl(instance(mockRepository));

            const userReturned = await service.increasePoint(id, amount);

            expect(userReturned).toBeDefined();
            expect(userReturned.getPoint()).toBe(amount);
        });
        it('should throw error "user with the id is not found"', async () => {
            when(mockRepository.findById(id)).thenReturn(undefined);
            service = new UserServiceImpl(instance(mockRepository));

            await expect(service.increasePoint(id, amount))
                .rejects
                .toThrowError('user with the id is not found');
        });
    });
    describe('#decreasePoint()', () => {
        const id = 1;
        const point = 100;
        const validAmount = 10;
        const invalidAmount = 1000;

        it('should return user with increased level', async () => {
            user = new User(address, name, point);
            when(mockRepository.findById(id)).thenReturn(new Promise((resolve => resolve(user))));
            service = new UserServiceImpl(instance(mockRepository));

            const userReturned = await service.decreasePoint(id, validAmount);

            expect(userReturned).toBeDefined();
            expect(userReturned.getPoint()).toBe(point - validAmount);
        });
        it('should throw error "user with the id is not found"', async () => {
            when(mockRepository.findById(id)).thenReturn(undefined);
            service = new UserServiceImpl(instance(mockRepository));

            await expect(service.decreasePoint(id, validAmount))
                .rejects
                .toThrowError('user with the id is not found');
        });
        it('should throw error "can not decrease point"', async () => {
            user = new User(address, name, point);
            when(mockRepository.findById(id)).thenReturn(new Promise((resolve => resolve(user))));
            service = new UserServiceImpl(instance(mockRepository));

            await expect(service.decreasePoint(id, invalidAmount))
                .rejects
                .toThrowError('can not decrease point');
        });
    });
    describe('#increaseLevel()', () => {
        const id = 1;
        const validAmount = 10;
        const invalidAmount = 1000;

        it('should return user with increased level', async () => {
            when(mockRepository.findById(id)).thenReturn(new Promise((resolve => resolve(user))));
            service = new UserServiceImpl(instance(mockRepository));

            const userReturned = await service.increaseLevel(id, validAmount);

            expect(userReturned).toBeDefined();
            expect(userReturned.getLevel()).toBe(validAmount);
        });
        it('should throw error "user with the id is not found"', async () => {
            when(mockRepository.findById(id)).thenReturn(undefined);
            service = new UserServiceImpl(instance(mockRepository));

            await expect(service.increaseLevel(id, validAmount))
                .rejects
                .toThrowError('user with the id is not found');
        });
        it('should throw error "can not increase level"', async () => {
            when(mockRepository.findById(id)).thenReturn(new Promise((resolve => resolve(user))));
            service = new UserServiceImpl(instance(mockRepository));

            await expect(service.increaseLevel(id, invalidAmount))
                .rejects
                .toThrowError('can not increase level');
        });
    });
});
