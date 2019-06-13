import {Test, TestingModule} from '@nestjs/testing';
import {ValidationServiceImpl} from './validation.service.impl';
import {instance, mock, when} from 'ts-mockito';
import {Web3Module} from '../../port/adapter/service/blockchain/ethereum/web3/web3.module';
import {ConfigModule} from 'nestjs-config';
import * as path from 'path';
import {Web3BridgeService} from '../../port/adapter/service/blockchain/ethereum/web3/web3.bridge.service';

describe('ValidationServiceImpl', () => {
  const mockBridgeService = mock(Web3BridgeService);
  let service: ValidationServiceImpl;

  describe('dependency resolve', () => {
    it('should be defined', async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [
          Web3Module,
          ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
        ],
        providers: [
          ValidationServiceImpl,
        ],
      }).compile();
      service = module.get<ValidationServiceImpl>(ValidationServiceImpl);

      expect(service).toBeDefined();
    });
  });
  describe('#verify()', () => {
    let message: string;
    const signature = 'signature';
    const address = 'testAddress';
    let data: { address: string, message: string };
    it('should return true', () => {
      message = 'data';
      data = {address, message};
      when(mockBridgeService.recover(message, signature)).thenReturn(address);

      service = new ValidationServiceImpl(instance(mockBridgeService));
      expect(service.verify(address, message, signature)).toBeTruthy();
    });
    it('should return false', () => {
      message = 'wrongData';
      data = {address, message};

      const wrongAddress = 'wrongAddress';
      when(mockBridgeService.recover(message, signature)).thenReturn(wrongAddress);

      service = new ValidationServiceImpl(instance(mockBridgeService));
      expect(service.verify(address, message, signature)).toBeFalsy();
    });

  });
});
