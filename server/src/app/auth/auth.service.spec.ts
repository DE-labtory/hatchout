import {Test, TestingModule} from '@nestjs/testing';
import {AuthService} from './auth.service';
import {JwtService} from '@nestjs/jwt';
import {anything, instance, mock, objectContaining, when} from 'ts-mockito';
import {UserServiceImpl} from '../user/user.service.impl';
import {ValidationServiceImpl} from '../../domain/user/validation.service.impl';
import {User} from '../../domain/user/user.entity';
import {Token} from './token.entity';
import {UserService} from '../user/user.service';
import {ValidationService} from '../../domain/user/validation.service';
import {SignUpResponseDto} from './dto/sign-up-response.dto';
import {SignInResponseDto} from './dto/sign-in-response.dto';

describe('AuthService', () => {
  let service: AuthService;
  const mockJwtService: JwtService = mock(JwtService);
  const mockUserService: UserServiceImpl = mock(UserServiceImpl);
  const mockValidationService: ValidationServiceImpl = mock(ValidationServiceImpl);

  const message: string = 'message';
  const signature: string = 'signature';
  const address: string = 'address';
  const name: string = 'name';
  const accessToken: string = 'token';

  describe('dependency injection', () => {
    it('should be defined', async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          AuthService,
          {provide: 'JwtService', useValue: instance(mockJwtService)},
          {provide: 'UserService', useValue: instance(mockUserService)},
          {provide: 'ValidationService', useValue: instance(mockValidationService)},
        ],
      }).compile();

      service = module.get<AuthService>(AuthService);
      expect(service).toBeDefined();
    });
  });

  describe('#createToken()', () => {
    it('should return a valid token', async () => {
      const result = {
        expiresIn: 3600,
        accessToken: 'address',
      };

      when(mockJwtService.sign(anything())).thenReturn(result.accessToken);
      service = new AuthService(instance(mockJwtService),
        instance(mockUserService),
        instance(mockValidationService));

      expect(service.createToken('address')).toEqual(result);
    });

    it('should throw "address should be defined"', async () => {
      service = new AuthService(instance(mockJwtService),
        instance(mockUserService),
        instance(mockValidationService));

      expect(() => {
        service.createToken(undefined);
      }).toThrow('address should be defined.');
    });
  });

  describe('#signUp', () => {
    it('should create a user', async () => {
      const mockService: AuthService = mock(AuthService);

      const user: User = new User(address, name);
      const jwt: Token = {
        expiresIn: 3600,
        accessToken: 'token',
      };

      const signUpResponseDto: SignUpResponseDto
        = new SignUpResponseDto(accessToken, address, name);

      when(mockValidationService.verify(address, message, signature))
        .thenReturn(true);

      when(mockUserService.create(address, name))
        .thenReturn(new Promise((resolve) => {
          resolve(user);
        }));

      when(mockService.createToken(address))
        .thenReturn(jwt);

      when(mockJwtService.sign(objectContaining({
        expiresIn: 3600,
        address,
      }))).thenReturn(accessToken);

      service = new AuthService(instance(mockJwtService),
        instance(mockUserService),
        instance(mockValidationService));

      await expect(service.signUp(address, name, message, signature)).resolves.toEqual(signUpResponseDto);
    });
    it('should throw UnauthorizedException()', async () => {

      when(mockValidationService.verify(address, message, signature))
        .thenReturn(false);

      service = new AuthService(instance(mockJwtService),
        instance(mockUserService),
        instance(mockValidationService));

      await expect(service.signUp(address, name, message, signature))
        .rejects.toThrow();
    });
    it('should throw UnauthorizedException()', async () => {
      const mockService: AuthService = mock(AuthService);

      when(mockValidationService.verify(address, message, signature))
        .thenReturn(true);

      when(mockUserService.create(address, name))
        .thenReturn(new Promise((resolve) => {
          resolve(undefined);
        }));

      when(mockService.createToken(address))
        .thenReturn(undefined);

      when(mockJwtService.sign(address)).thenReturn(undefined);

      service = new AuthService(instance(mockJwtService),
        instance(mockUserService),
        instance(mockValidationService));

      await expect(service.signUp(address, name, message, signature))
        .rejects.toThrow();
    });
  });

  describe('#signIn', () => {
    it('should return a user', async () => {

      const mockService: AuthService = mock(AuthService);

      const user: User = new User(address, name);
      const jwt: Token = {
        expiresIn: 3600,
        accessToken: 'token',
      };

      const signInResponseDto: SignInResponseDto
        = new SignInResponseDto(accessToken, address, name);

      when(mockValidationService.verify(address, message, signature))
        .thenReturn(true);

      when(mockUserService.getByAddress(address))
        .thenReturn(new Promise((resolve) => {
          resolve(user);
        }));

      when(mockService.createToken(address))
        .thenReturn(jwt);

      when(mockJwtService.sign(address)).thenReturn(accessToken);

      service = new AuthService(instance(mockJwtService),
        instance(mockUserService),
        instance(mockValidationService));

      await expect(service.signIn(address, message, signature)).resolves.toEqual(signInResponseDto);
    });
    it('should throw UnauthorizedException()', async () => {

      when(mockValidationService.verify(address, message, signature))
        .thenReturn(false);

      service = new AuthService(instance(mockJwtService),
        instance(mockUserService),
        instance(mockValidationService));

      await expect(service.signUp(address, name, message, signature))
        .rejects.toThrow();
    });
    it('should throw "user not found"', async () => {

      when(mockValidationService.verify(address, message, signature))
        .thenReturn(true);

      when(mockUserService.getByAddress(address))
        .thenReturn(new Promise((resolve) => {
          resolve(undefined);
        }));

      service = new AuthService(instance(mockJwtService),
        instance(mockUserService),
        instance(mockValidationService));

      await expect(service.signUp(address, name, message, signature))
        .rejects.toThrow();
    });
    it('should throw UnauthorizedException', async () => {

      when(mockValidationService.verify(address, message, signature))
        .thenReturn(false);

      when(mockUserService.getByAddress(address))
        .thenReturn(new Promise((resolve) => {
          resolve(undefined);
        })).thenThrow(new Error('user not found'));

      service = new AuthService(instance(mockJwtService),
        instance(mockUserService),
        instance(mockValidationService));

      await expect(service.signIn(address, message, signature))
        .rejects.toThrow();
    });
  });
});
