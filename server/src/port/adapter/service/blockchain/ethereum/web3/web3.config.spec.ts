import { Test, TestingModule } from '@nestjs/testing';
import { Web3Config } from './web3.config';
import * as path from 'path';
import { ConfigModule } from 'nestjs-config';

describe('Web3provider', () => {
  let config: Web3Config;
  afterAll(() => setTimeout(() => process.exit(), 1000));
  it('should load http provided web3', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Web3Config],
      imports: [
        ConfigModule.load(path.resolve(__dirname + '/test/http', 'config', '**/!(*.d).{ts,js}')),
      ],
    }).compile();
    config = module.get<Web3Config>(Web3Config);
    const provider = config.getProvider();
    expect((provider.constructor.name === 'HttpProvider')).toBe(true);
  });
  it('should load socket provided web3', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Web3Config],
      imports: [
        ConfigModule.load(path.resolve(__dirname + '/test/socket', 'config', '**/!(*.d).{ts,js}')),
      ],
    }).compile();
    config = module.get<Web3Config>(Web3Config);
    const provider = config.getProvider();
    expect(provider.constructor.name === 'WebsocketProvider').toBe(true);
  });
});
