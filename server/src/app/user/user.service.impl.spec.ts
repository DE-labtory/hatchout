import {UserServiceImpl} from './user.service.impl';
import {anything, instance, mock, when} from 'ts-mockito';
import {TestingModule, Test} from '@nestjs/testing';
import {User} from '../../domain/user/user.entity';
import {NotAcceptableException, NotFoundException} from '@nestjs/common';
import {UserDto} from './dto/user.dto';
import {ValidationException} from '../../domain/exception/ValidationException';
import {InvalidParameterException} from '../../domain/exception/InvalidParameterException';
import {UserRepository} from '../../port/persistence/repository/user.repository.impl';

describe('UserServiceImpl', () => {
    const address = 'testAddress';
    const name = 'testName';
    const mockRepository: UserRepository = mock(UserRepository);
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
                        provide: 'UserRepository',
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
        it('should throw NotFoundException', async () => {
            when(mockRepository.findById(null)).thenReturn(undefined);
            service = new UserServiceImpl(instance(mockRepository));

            await expect(service.get(null))
                .rejects
                .toThrowError(NotFoundException);
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

            expect(await service.create(address, name)).toBe(user);
        });
        it('should throw InvalidParameterException', async () => {
            when(mockRepository.findByAddress(address)).thenReturn(
                new Promise((resolve => {resolve(user); }),
                ),
            );
            service = new UserServiceImpl(instance(mockRepository));

            await expect(service.create(address, undefined))
                .rejects
                .toThrowError(InvalidParameterException);
        });
        it('should throw InvalidParameterException', async () => {
            when(mockRepository.findByAddress(address)).thenReturn(
                new Promise((resolve => {resolve(user); }),
                ),
            );
            service = new UserServiceImpl(instance(mockRepository));

            await expect(service.create(undefined, name))
                .rejects
                .toThrowError(InvalidParameterException);
        });
        it('should throw NotAcceptableException', async () => {
            when(mockRepository.findByAddress(address)).thenReturn(
                new Promise((resolve => {resolve(user); }),
                ),
            );
            service = new UserServiceImpl(instance(mockRepository));
            userDto = new UserDto(address, name);

            await expect(service.create(address, name))
                .rejects
                .toThrowError(NotAcceptableException);
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
        const validAmount = 10;
        const invalidAmount = -1;

        it('should return user with increased point', async () => {
            when(mockRepository.findById(id)).thenReturn(new Promise((resolve => resolve(user))));
            service = new UserServiceImpl(instance(mockRepository));

            const userReturned = await service.increasePoint(id, validAmount);

            expect(userReturned).toBeDefined();
            expect(userReturned.getPoint()).toBe(validAmount);
        });
        it('should throw error NotFoundException', async () => {
            when(mockRepository.findById(id)).thenReturn(undefined);
            service = new UserServiceImpl(instance(mockRepository));

            await expect(service.increasePoint(id, validAmount))
                .rejects
                .toThrowError(NotFoundException);
        });
        it('should throw ValidationException when amount is negative', async () => {
            when(mockRepository.findById(id)).thenReturn(new Promise((resolve => resolve(user))));
            service = new UserServiceImpl(instance(mockRepository));

            await expect(service.increasePoint(id, invalidAmount))
                .rejects
                .toThrowError(ValidationException);

        });
    });
    describe('#decreasePoint()', () => {
        const id = 1;
        const point = 100;
        const validAmount = 10;
        let invalidAmount: number;

        it('should return user with increased level', async () => {
            user = new User(address, name, point);
            when(mockRepository.findById(id)).thenReturn(new Promise((resolve => resolve(user))));
            service = new UserServiceImpl(instance(mockRepository));

            const userReturned = await service.decreasePoint(id, validAmount);

            expect(userReturned).toBeDefined();
            expect(userReturned.getPoint()).toBe(point - validAmount);
        });
        it('should throw error NotFoundException', async () => {
            when(mockRepository.findById(id)).thenReturn(undefined);
            service = new UserServiceImpl(instance(mockRepository));

            await expect(service.decreasePoint(id, validAmount))
                .rejects
                .toThrowError(NotFoundException);
        });
        it('should throw ValidationException when amount is negative', async () => {
            invalidAmount = -1;
            user = new User(address, name, point);
            when(mockRepository.findById(id)).thenReturn(new Promise((resolve => resolve(user))));
            service = new UserServiceImpl(instance(mockRepository));

            await expect(service.decreasePoint(id, invalidAmount))
                .rejects
                .toThrowError(ValidationException);
        });
        it('should throw ValidationException when point becomes less than MIN_POINT', async () => {
            invalidAmount = 1000;
            user = new User(address, name, point);
            when(mockRepository.findById(id)).thenReturn(new Promise((resolve => resolve(user))));
            service = new UserServiceImpl(instance(mockRepository));

            await expect(service.decreasePoint(id, invalidAmount))
                .rejects
                .toThrowError(ValidationException);
        });
    });
    describe('#increaseLevel()', () => {
        const id = 1;
        const validAmount = 10;
        let invalidAmount: number;

        it('should return user with increased level', async () => {
            when(mockRepository.findById(id)).thenReturn(new Promise((resolve => resolve(user))));
            service = new UserServiceImpl(instance(mockRepository));

            const userReturned = await service.increaseLevel(id, validAmount);

            expect(userReturned).toBeDefined();
            expect(userReturned.getLevel()).toBe(validAmount);
        });
        it('should throw error NotFoundException', async () => {
            when(mockRepository.findById(id)).thenReturn(undefined);
            service = new UserServiceImpl(instance(mockRepository));

            await expect(service.increaseLevel(id, validAmount))
                .rejects
                .toThrowError(NotFoundException);
        });
        it('should throw ValidationException when amount is negative', async () => {
            invalidAmount = -1;
            when(mockRepository.findById(id)).thenReturn(new Promise((resolve => resolve(user))));
            service = new UserServiceImpl(instance(mockRepository));

            await expect(service.increaseLevel(id, invalidAmount))
                .rejects
                .toThrowError(ValidationException);
        });
        it('should throw ValidationException when level becomes more than MAX_LEVEL', async () => {
            invalidAmount = 1000;
            when(mockRepository.findById(id)).thenReturn(new Promise((resolve => resolve(user))));
            service = new UserServiceImpl(instance(mockRepository));

            await expect(service.increaseLevel(id, invalidAmount))
                .rejects
                .toThrowError(ValidationException);
        });
    });
});
