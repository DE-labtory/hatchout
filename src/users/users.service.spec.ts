import { Test } from '@nestjs/testing';
import {User} from './user.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import {UserDto} from './user.dto';
import {UsersService} from './users.service';
import {UsersServiceImpl} from './users.service.impl';

describe('UsersService', async () => {

  let service: UsersService;
  const mockUser = new User();
  mockUser.id = 1;
  mockUser.address = 'testAddress';

  const mockUserUpdated = new User();
  mockUserUpdated.id = 1;
  mockUserUpdated.address = 'testAddressUpdated';

  beforeAll(async () => {

    const module = await Test.createTestingModule({
      providers: [
          UsersServiceImpl,
      ],
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: 'rootpassword',
          database: 'hatchout_server',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
      ],
    })
        .compile();

    service = module.get<UsersService>(UsersServiceImpl);


  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be saved', async () => {

    //given
    const module = await Test.createTestingModule({
      providers: [
          UsersServiceImpl,
      ],
      imports: [
        TypeOrmModule.forFeature([User]),
      ],
    })
        .overrideProvider(getRepositoryToken(User))
        .useValue({
            save: () => mockUser,
            findById: () => mockUser,
            findByAddress: () => undefined,
        })
        .compile();

    service = module.get<UsersService>(UsersServiceImpl);

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
    const module = await Test.createTestingModule({
      providers: [
          UsersServiceImpl,
      ],
      imports: [
        TypeOrmModule.forFeature([User]),
      ],
    })
        .overrideProvider(getRepositoryToken(User))
        .useValue({
          findByAddress:() => mockUser,
            save:() => undefined,

        })
        .compile();

    service = module.get<UsersService>(UsersServiceImpl);

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
    const module = await Test.createTestingModule({
      providers: [
          UsersServiceImpl,
      ],
      imports: [
        TypeOrmModule.forFeature([User]),
      ],
    })
        .overrideProvider(getRepositoryToken(User))
        .useValue({
          findById:() => mockUserUpdated,
          findByAddress:() => mockUser,
          save: () => mockUserUpdated,

        })
        .compile();

    service = module.get<UsersService>(UsersServiceImpl);

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
    const module = await Test.createTestingModule({
      providers: [
          UsersServiceImpl,
      ],
      imports: [
        TypeOrmModule.forFeature([User]),
      ],
    })
        .overrideProvider(getRepositoryToken(User))
        .useValue({
          findByAddress:() => undefined,
        })
        .compile();

    service = module.get<UsersService>(UsersServiceImpl);

    const newUserDto = new UserDto();

    //when & then
    await expect(service.update(newUserDto))
        .rejects
        .toThrowError('unable to update');

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

    it('should not delete', async () => {

        const module = await Test.createTestingModule({
            providers: [
                UsersServiceImpl,
            ],
            imports: [
                TypeOrmModule.forFeature([User]),
            ],
        })
            .overrideProvider(getRepositoryToken(User))
            .useValue({
                findById:() => undefined,
            })
            .compile();

        service = module.get<UsersService>(UsersServiceImpl);

        //when & then
        await expect(service.delete(null))
            .rejects
            .toThrowError('unable to delete')


    });

});
