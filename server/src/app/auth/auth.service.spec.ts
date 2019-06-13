import {Test, TestingModule} from '@nestjs/testing';
import {AuthService} from './auth.service';
import {JwtService} from '@nestjs/jwt';
import {anyString, anything, instance, mock, objectContaining, when} from 'ts-mockito';
import {UserServiceImpl} from '../user/user.service.impl';
import {ValidationServiceImpl} from '../../domain/user/validation.service.impl';
import {User} from '../../domain/user/user.entity';
import {Token} from './token.entity';
import {UserService} from '../user/user.service';
import {ValidationService} from '../../domain/user/validation.service';
import {SignUpResponseDto} from './dto/sign-up-response.dto';
import {SignInResponseDto} from './dto/sign-in-response.dto';
import {BadRequestException, NotFoundException, UnauthorizedException} from '@nestjs/common';

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
  const expiresIn: number = 3600;

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
      const jwt = {
        expiresIn,
        accessToken: 'address',
      };

      when(mockJwtService.sign(anything())).thenReturn(jwt.accessToken);
      service = new AuthService(instance(mockJwtService),
        instance(mockUserService),
        instance(mockValidationService));

      expect(service.createToken('address')).toEqual(jwt);
    });

    it('should throw BadRequestException()', async () => {
      service = new AuthService(instance(mockJwtService),
        instance(mockUserService),
        instance(mockValidationService));

      expect(() => {
        service.createToken(undefined);
      }).toThrowError(BadRequestException);
    });
  });

  describe('#signUp', () => {
    it('should create a user', async () => {
      const user: User = new User(address, name);
      const jwt: Token = {
        expiresIn,
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

      when(mockJwtService.sign(objectContaining({
        expiresIn,
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
        .rejects.toThrowError(UnauthorizedException);
    });
  });

  describe('#signIn', () => {
    it('should return a user', async () => {
      const user: User = new User(address, name);
      const signInResponseDto: SignInResponseDto
        = new SignInResponseDto(accessToken, address, name);

      when(mockValidationService.verify(address, message, signature))
        .thenReturn(true);

      when(mockUserService.getByAddress(address))
        .thenReturn(new Promise((resolve) => {
          resolve(user);
        }));

      when(mockJwtService.sign(anything())).thenReturn(accessToken);

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
        .rejects.toThrowError(UnauthorizedException);
    });
  });
});
