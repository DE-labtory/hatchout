import {AuthController} from './auth.controller';
import {Test, TestingModule} from '@nestjs/testing';
import {AuthService} from '../app/auth/auth.service';
import {anyString, instance, mock, when} from 'ts-mockito';
import {Token} from '../app/auth/token.entity';
import {UnauthorizedException} from '@nestjs/common';
import {SignUpResponseDto} from '../app/auth/dto/sign-up-response.dto';
import {SignInResponseDto} from '../app/auth/dto/sign-in-response.dto';
import {SignInRequestDto} from '../app/auth/dto/sign-in-request.dto';
import {SignUpRequestDto} from '../app/auth/dto/sign-up-request.dto';
import {CreateTokenRequestDto} from '../app/auth/dto/create-token-request.dto';

describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthService: AuthService = mock(AuthService);

  const message = 'message';
  const signature = 'signature';
  const address = 'address';
  const name = 'name';
  const signInRequestDto = new SignInRequestDto(address, message, signature);
  const signUpRequestDto = new SignUpRequestDto(address, name, message, signature);
  const createTokenRequestDto = new CreateTokenRequestDto(address, message, signature);

  it('should be defined', async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        AuthController,
      ],
      providers: [
        {provide: 'AuthService', useValue: instance(mockAuthService)},
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('#createToken()', () => {
    it('should return a valid token', async () => {
      const jwt: Token = {
        expiresIn: 3600,
        accessToken: 'token',
      } as Token;
      when(mockAuthService.createToken(address)).thenReturn(jwt);

      controller = new AuthController(instance(mockAuthService));

      expect(await controller.createToken(createTokenRequestDto)).toBe(jwt);
    });

    it('should return undefined', async () => {
      when(mockAuthService.createToken(address)).thenReturn(undefined);

      controller = new AuthController(instance(mockAuthService));

      expect(await controller.createToken(createTokenRequestDto)).toEqual(undefined);
    });
  });

  describe('#signUp()', () => {
    it('should create a user', async () => {
      const jwt: Token = {
        expiresIn: 3600,
        accessToken: 'token',
      } as Token;

      const authDto = new SignUpResponseDto(jwt.accessToken, message, name);
      when(mockAuthService.signUp(anyString(), anyString(), anyString(), anyString())).thenReturn(new Promise(resolve => {
        resolve(authDto);
      }));

      controller = new AuthController(instance(mockAuthService));

      expect(await controller.signUp(signUpRequestDto)).toBe(authDto);
    });
  });

  describe('#signIn()', () => {
    it('should return a user', async () => {
      const jwt: Token = {
        expiresIn: 3600,
        accessToken: 'token',
      } as Token;
      const authDto = new SignInResponseDto(jwt.accessToken, message, name);
      when(mockAuthService.signIn(address, message, signature)).thenReturn(new Promise(resolve => {
        resolve(authDto);
      }));

      controller = new AuthController(instance(mockAuthService));

      expect(await controller.signIn(signInRequestDto)).toBe(authDto);
    });
  });
});
