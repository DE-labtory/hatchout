import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { instance, mock, when } from 'ts-mockito';
import { ConfigModule, ConfigService } from 'nestjs-config';
import * as path from 'path';

describe('AuthService', () => {
  let service: AuthService;
  const mockJwtService: JwtService = mock(JwtService);
  const mockConfigService: ConfigService = mock(ConfigService);

  describe('dependency injection', () => {

    it('should be defined', async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
            AuthService,
          {provide: 'JwtService', useValue: instance(mockJwtService)},
          // {provide: ConfigService, useFactory: () => instance(mockConfigService)},
        ],
        imports: [
            ConfigModule.load(path.resolve(__dirname, '../../config', '**/!(*.d).{ts,js}')),
        ],
      }).compile();
      service = module.get<AuthService>(AuthService);
      expect(service).toBeDefined();
    });
  });

  describe('#createToken()', () => {
    let configService: ConfigService;

    beforeEach(async () => {
      configService = await ConfigService.load(
          path.resolve( __dirname, '../../config', '**/!(*.d).{ts,js}'),
      );
    });

    it('should return a valid token', async () => {
      const userAddress = 'valid';
      const accessToken = mockJwtService.sign(userAddress);
      const result = {
        expiresIn: 3600,
            // configService.get('auth.signOptions.expiresIn'),
        accessToken,
      };

      when(mockJwtService.sign(userAddress)).thenReturn(accessToken);

      // console.log('config: ' + configService);

      // what the...........
      // service = new AuthService(instance(mockJwtService), configService.get('auth.signOptions.expiresIn'));
      // service = new AuthService(instance(mockJwtService), instance(configService.get('auth.signOptions.expiresIn')));
      // service = new AuthService(instance(mockJwtService), configService.get('auth'));
      // service = new AuthService(instance(mockJwtService), instance(configService));
      // service = new AuthService(instance(mockJwtService), instance(mockConfigService));
      // service = new AuthService(instance(mockJwtService), instance(configService));

      await expect(service.createToken(userAddress)).toEqual(result);
    });
    it('should throw "email should be defined"', async () => {
      const userAddress = null;
      const accessToken = mockJwtService.sign(userAddress);

      when(mockJwtService.sign(userAddress)).thenReturn(accessToken);
      // service = new AuthService(instance(mockJwtService), instance(mockConfigService));

      await expect(service.createToken(null))
          .rejects
          .toThrowError('address should be defined.');
    });

  });
});
