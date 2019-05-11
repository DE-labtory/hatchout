import { Test, TestingModule } from '@nestjs/testing';
import { Client } from './client';

describe('Client', () => {
  let provider: Client;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Client],
    }).compile();

    provider = module.get<Client>(Client);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
