import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import {User} from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {UserDto} from './user.dto';

describe('UsersService', () => {

  let service: UsersService;
  const mockUser = new User();
  mockUser.address = 'testAddress';
  mockUser.id = 1;
  const mockRepository = {
    data: [
      { id: 1, address: 'testAddress'},
    ],
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    })
        .compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be saved, get', async () => {

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    })
        .overrideProvider(getRepositoryToken(User))
        .useValue({
          save: () => mockUser,
          findById: () => mockUser,
          delete: () => undefined,
        })
        .compile();

    service = module.get<UsersService>(UsersService);



    const newUserDto = new UserDto();
    newUserDto.address = 'testAddress';
    const createdUser = await service.createUser(newUserDto);
    expect(createdUser.address).toBe(newUserDto.address);
    // // todo: 이거 돼야하는 거 아닌지 확인
    const retrievedUser = await service.getUser(1);
    expect(retrievedUser.address).toBe(newUserDto.address);
    const deletedUser = await service.deleteUser(1);
    expect(deletedUser).toBeUndefined()



  });


});
