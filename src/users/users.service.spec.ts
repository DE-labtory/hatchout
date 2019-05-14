import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import {User} from './user.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import {UserDto} from './user.dto';

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
        UsersService,
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

    service = module.get<UsersService>(UsersService);


  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be saved', async () => {

    //given
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
      ],
      imports: [
        TypeOrmModule.forFeature([User]),
      ],
    })
        .overrideProvider(getRepositoryToken(User))
        .useValue({
          save: () => mockUser,
          findById: () => mockUser,
        })
        .compile();

    service = module.get<UsersService>(UsersService);

    const newUserDto = new UserDto();
    newUserDto.address = 'testAddress';

    //when
    const createdUser = await service.createUser(newUserDto);

    //then
    expect(createdUser.address).toBe(newUserDto.address);

    //when
    const retrievedUser = await service.getUser(1);

    //then
    expect(retrievedUser.address).toBe(createdUser.address);

  });

  it('should not be saved', async () => {
    //given
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
      ],
      imports: [
        TypeOrmModule.forFeature([User]),
      ],
    })
        .overrideProvider(getRepositoryToken(User))
        .useValue({
          findByAddress:() => mockUser,

        })
        .compile();

    service = module.get<UsersService>(UsersService);

    const newUserDto = new UserDto();

    //when & then
    await expect(service.createUser(newUserDto))
        .rejects
        .toThrowError('address is undefined');

    //given
    newUserDto.address = 'testAddress';

    //when & then
    await expect(service.createUser(newUserDto))
        .rejects
        .toThrowError('user with the address already exists')

  });

  it('shoud be updated', async () => {

    //given
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
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

    service = module.get<UsersService>(UsersService);

    const newUserDto = new UserDto();
    newUserDto.address = 'testAddressUpdated';

    //when
    const updatedUser = await service.updateUser(newUserDto);

    //then
    expect(updatedUser.address).toBe(newUserDto.address);

    //when
    const retrievedUser = await service.getUser(1);

    //then
    expect(retrievedUser.address).toBe(updatedUser.address);

  });


});
