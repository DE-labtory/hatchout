import { Test, TestingModule } from '@nestjs/testing';
import Web3 from 'web3';
import { Web3Module, web3Provider } from './web3.module';
import * as path from 'path';
import { ConfigModule } from 'nestjs-config';
import { Web3provider } from './web3provider';

describe('Web3Module', () => {
  let web3: Web3;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...web3Provider, Web3provider],
      exports: [...web3Provider],
      imports: [
        ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
      ],
    }).compile();
    web3 = module.get<Web3>('WEB3');
  });
  it('should be defined', () => {
    expect(web3).toBeDefined();
  });
});
