import {UserService} from './user.service';
import {Test, TestingModule} from '@nestjs/testing';
import {UserServiceImpl} from './user.service.impl';
import {User} from './user.entity';
import {getRepositoryToken} from '@nestjs/typeorm';
import {newMockRepository} from '../../mock/factory';

const mockUser = new User();
mockUser.id = 1;
mockUser.address = 'testAddress';

describe('user.service.impl', () => {

    let service: UserService;

    it('should be defined', async () => {

        const mockRepository = newMockRepository(null, null, null);

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserServiceImpl,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockRepository,
                },
            ],

        }).compile();

        service = module.get<UserService>(UserServiceImpl);

        expect(service).toBeDefined();
    });

    describe('isAbleToCreate', () => {
        it('should return false', async () => {

            const mockRepositroy = newMockRepository(null, mockUser, null);

            service = new UserServiceImpl(mockRepositroy);

            expect(await service.isAbleToCreate(undefined)).toBeFalsy();

            expect(await service.isAbleToCreate('address')).toBeFalsy();
        });

        it('should return true', async () => {

            const mockRepositroy =  newMockRepository(null, undefined, null);

            service = new UserServiceImpl(mockRepositroy);

            expect(await service.isAbleToCreate('address')).toBeTruthy();

        });
    });

    describe('isAbleToDelete', () => {
        it('should return false', async () => {

            const mockRepositroy = newMockRepository(undefined, null, null);

            service = new UserServiceImpl(mockRepositroy);

            expect(await service.isAbleToDelete(null)).toBeFalsy();
            expect(await service.isAbleToDelete(1)).toBeFalsy();
        });

        it('should return true', async () => {

            const mockRepositroy = newMockRepository(mockUser, null, null);

            service = new UserServiceImpl(mockRepositroy);

            expect(await service.isAbleToDelete(1)).toBeTruthy();

        });
    });

    describe('isAbleToGet', () => {
        it('should return false', async () => {

            const mockRepositroy = newMockRepository(null,null,null);

            service = new UserServiceImpl(mockRepositroy);

            expect(await service.isAbleToGet(null)).toBeFalsy();
        });

        it('should return true', async () => {

            const MockRepository = jest.fn().mockImplementation(() => {});

            const mockRepositroy = new MockRepository();

            service = new UserServiceImpl(mockRepositroy);

            expect(await service.isAbleToGet(1)).toBeTruthy();
        });
    });

    describe('isAbleToUpdate', () => {
        it('should return false', async () => {
            const mockRepositroy = newMockRepository(null, undefined, null);

            service = new UserServiceImpl(mockRepositroy);

            expect(await service.isAbleToUpdate(undefined)).toBeFalsy();
            expect(await service.isAbleToUpdate('address')).toBeFalsy();

        });

        it('should return true', async () => {

            const mockRepositroy = newMockRepository(null, mockUser, null);

            service = new UserServiceImpl(mockRepositroy);

            expect(await service.isAbleToUpdate('address')).toBeTruthy();

        });
    });
});
