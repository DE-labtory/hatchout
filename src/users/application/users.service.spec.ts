import {User} from '../domain/user.entity';
import {UserDto} from '../domain/dto/user.dto';
import {UsersService} from './users.service';
import {UserServiceImpl} from './user.service.impl';

//given
const mockUser = new User();
mockUser.id = 1;
mockUser.address = 'testAddress';

const mockUserUpdated = new User();
mockUserUpdated.id = 1;
mockUserUpdated.address = 'testAddressUpdated';

describe('UsersService', async () => {

  let service: UsersService;

  beforeAll(async () => {

  const mockRepository = makeMockRepository(null, null, null);
  service = new UserServiceImpl(mockRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be saved', async () => {
    //given
    const mockRepository = makeMockRepository(mockUser, undefined, mockUser);

    service = new UserServiceImpl(mockRepository);

    const newUserDto = new UserDto();
    newUserDto.address = 'testAddress';

    //when
    const createdUser = await service.create(newUserDto);

    //then
    expect(createdUser.address).toBe(newUserDto.address);

    //when
    const retrievedUser = await service.get(1);

    //then
    expect(retrievedUser.address).toBe(createdUser.address);

  });

  it('should not be saved', async () => {

    //given
    const mockRepository = makeMockRepository(null, mockUser, null );

    service = new UserServiceImpl(mockRepository);

    const newUserDto = new UserDto();

    // when & then
    await expect(service.create(newUserDto))
        .rejects
        .toThrowError('unable to create');

    //given
    newUserDto.address = 'testAddress';

    //when & then
    await expect(service.create(newUserDto))
        .rejects
        .toThrowError('unable to create')

  });

  it('shoud be updated', async () => {
    //given
    const mockRepository = makeMockRepository(mockUserUpdated, mockUser, mockUserUpdated);

    service = new UserServiceImpl(mockRepository);

    const newUserDto = new UserDto();
    newUserDto.address = 'testAddressUpdated';

    //when
    const updatedUser = await service.update(newUserDto);

    //then
    expect(updatedUser.address).toBe(newUserDto.address);

    //when
    const retrievedUser = await service.get(1);

    //then
    expect(retrievedUser.address).toBe(updatedUser.address);

  });

  it('should not be updated', async () => {

    //given
    const mockRepository = makeMockRepository(null, undefined, null);

    service = new UserServiceImpl(mockRepository);

    const newUserDto = new UserDto();

    //when & then
    await expect(service.update(newUserDto))
        .rejects
        .toThrowError('unable to update');

    //given
    newUserDto.address = 'testAddress';

    //when & then
    await expect(service.update(newUserDto))
        .rejects
        .toThrowError('unable to update')
  });

    it('should not get', async () => {
        //when & then
        await expect(service.get(null))
            .rejects
            .toThrowError('unable to get')

    });

    it('should delete', async () => {
        //given
        const mockRepository = makeMockRepository(mockUser, null, null);

        service = new UserServiceImpl(mockRepository);
        expect(await service.delete(1)).toBeUndefined();
    });

    it('should not delete', async () => {

        //given
        const mockRepository = makeMockRepository(undefined, null, null);

        service = new UserServiceImpl(mockRepository);

        //when & then
        await expect(service.delete(null))
            .rejects
            .toThrowError('unable to delete');

        //when & then

        await expect(service.delete(1))
            .rejects
            .toThrowError('unable to delete');
    });

});

function makeMockRepository(findById: User, findByAddress: User, save: User) {
    const MockRepository = jest.fn().mockImplementation(() => {
        return {

            findById: jest.fn().mockImplementation(() => findById),
            findByAddress: jest.fn().mockImplementation(() => findByAddress),
            save: jest.fn().mockImplementation(() => save),
            delete: jest.fn().mockImplementation(() => undefined)
        };
    });

    return new MockRepository();
}
