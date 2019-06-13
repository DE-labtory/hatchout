import { AuthController } from './auth.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../app/auth/auth.service';
import { instance, mock, when } from 'ts-mockito';
import { Token } from '../app/auth/token.entity';
import { UnauthorizedException } from '@nestjs/common';
import { SignUpResponseDto } from '../app/auth/dto/sign-up-response.dto';
import { SignInResponseDto } from '../app/auth/dto/sign-in-response.dto';
import { SignInRequestDto } from '../app/auth/dto/sign-in-request.dto';

describe('AuthController', () => {
    let controller: AuthController;
    const mockAuthService: AuthService = mock(AuthService);

    const message = 'message';
    const signature = 'signature';
    const address = 'address';
    const data = new SignInRequestDto(address, message, signature);
    const name = 'name';

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
            const authService: AuthService = mock(AuthService);
            const jwt: Token = authService.createToken(address);

            when(mockAuthService.createToken(address)).thenReturn(jwt);

            controller = new AuthController(instance(mockAuthService));

            expect(await controller.createToken(data)).toBe(jwt);
        });

        it('should return undefined', async () => {
            when(mockAuthService.createToken(address)).thenReturn(undefined);

            controller = new AuthController(instance(mockAuthService));

            expect(await controller.createToken(data)).toEqual(undefined);
        });
    });

    describe('#signUp()', () => {
        it('should create a user', async () => {
            const authService: AuthService = mock(AuthService);

            const jwt: Token = authService.createToken(address);
            const authDto = new SignUpResponseDto(jwt.accessToken, message, name);

            when(mockAuthService.signUp(address, message, signature)).thenReturn(new Promise(resolve => {
                resolve(authDto);
            }));

            controller = new AuthController(instance(mockAuthService));

            expect(await controller.signUp(data)).toBe(authDto);
        });

        it('should return null', async () => {
            when(mockAuthService.signUp(address, message, signature))
                .thenReject().thenThrow(new UnauthorizedException());

            controller = new AuthController(instance(mockAuthService));

            expect(await controller.createToken(data))
                .toEqual(undefined);
        });
    });

    describe('#signIn()', () => {
        it('should return a user', async () => {
            const authService: AuthService = mock(AuthService);

            const jwt: Token = authService.createToken(address);
            const authDto = new SignInResponseDto(jwt.accessToken, message, name);

            when(mockAuthService.signIn(address, message, signature)).thenReturn(new Promise(resolve => {
                resolve(authDto);
            }));

            controller = new AuthController(instance(mockAuthService));

            expect(await controller.signIn(data)).toBe(authDto);
        });

        it('should throw "user not found"', async () => {
            when(mockAuthService.signUp(address, message, signature))
                .thenReject().thenThrow(new UnauthorizedException());

            controller = new AuthController(instance(mockAuthService));

            expect(await controller.createToken(data))
                .toEqual(undefined);
        });
    });
});
