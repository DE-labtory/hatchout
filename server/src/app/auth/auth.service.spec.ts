import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { anything, instance, mock, when } from 'ts-mockito';

describe('AuthService', () => {
  let service: AuthService;
  const mockJwtService: JwtService = mock(JwtService);

  describe('dependency injection', () => {

    it('should be defined', async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
            AuthService,
          {provide: 'JwtService', useValue: instance(mockJwtService)},
        ],
      }).compile();

      service = module.get<AuthService>(AuthService);
      expect(service).toBeDefined();
    });
  });

  describe('#createToken()', async () => {
    it('should return a valid token', async () => {
      const address = 'valid';
      const accessToken = mockJwtService.sign(address);

      const result = {
        expiresIn: 3600,
        accessToken,
      };
      when(mockJwtService.sign(anything())).thenReturn(accessToken);
      service = new AuthService(instance(mockJwtService));

      expect(service.createToken(address)).toEqual(result);
    });

  });
});
