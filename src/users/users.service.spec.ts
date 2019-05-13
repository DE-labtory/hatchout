import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import {User} from './user.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import {UserDto} from './user.dto';
import {UsersModule} from './users.module';

describe('UsersService', async () => {

  let service: UsersService;
  const mockUser = new User();
  mockUser.address = 'testAddress';
  mockUser.id = 1;

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
        .overrideProvider(getRepositoryToken(User))
        .useValue({
          save: () => mockUser,
          findById: () => mockUser,
          delete: () => undefined,
        })
        .compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be saved, get', async () => {

    const newUserDto = new UserDto();
    newUserDto.address = 'testAddress';
    const createdUser = await service.createUser(newUserDto);
    expect(createdUser.address).toBe(newUserDto.address);
    const retrievedUser = await service.getUser(1);
    expect(retrievedUser.address).toBe(newUserDto.address);
    const deletedUser = await service.deleteUser(1);
    expect(deletedUser).toBeUndefined()

  });


});
