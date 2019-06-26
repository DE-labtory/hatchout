import {Test, TestingModule} from '@nestjs/testing';
import {EventSubscriber} from './event.subscriber';
import {Web3Module} from '../web3/web3.module';
import * as path from 'path';
import {ConfigModule} from 'nestjs-config';

describe('EventSubscriber', () => {
    const testUrl = 'ws://localhost:8545';
    let service: EventSubscriber;

    afterAll(() => setTimeout(() => process.exit(), 1000));

    describe('dependency resolve', () => {
        it('should be defined', async () => {
            const module: TestingModule = await Test.createTestingModule({
                providers: [EventSubscriber],
                imports: [
                    Web3Module, ConfigModule.load(path.resolve('/test/socket', 'config', '**/!(*.d).{ts,js}')),
                ],
            }).compile();
            service = module.get<EventSubscriber>(EventSubscriber);
        });
    });
});
