import { Test, TestingModule } from '@nestjs/testing';
import Web3 from 'web3';
import { Web3Module } from './web3.module';
import * as path from 'path';
import { ConfigModule } from 'nestjs-config';

describe('Web3Module', () => {
  let web3: Web3;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        Web3Module,
        ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
      ],
    }).compile();
    web3 = module.get<Web3>('WEB3');
  });
  it('should be defined', () => {
    expect(web3).toBeDefined();
  });
});
