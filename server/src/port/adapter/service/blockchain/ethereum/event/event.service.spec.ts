import {Test, TestingModule} from '@nestjs/testing';
import {EventService} from './event.service';
import {Web3Module} from '../web3/web3.module';
import * as path from 'path';
import {ConfigModule} from 'nestjs-config';
import {mock} from 'ts-mockito';
import Web3 from 'web3';
import {Contract} from 'web3-eth-contract';
import {EventList} from './list/event';
import {ContractFactoryModule} from '../web3/contract/contract.module';
import {AbiModule} from '../web3/abi/abi.module';

describe('EventService', () => {
    const testUrl = 'ws://localhost:8545';
    const testAddress = '';
    let mockedWeb3: Web3 = mock(Web3);
    let mockedContract: Contract = mock(Contract);
    let mockedEventService: EventService = mock(EventService);
    let service: EventService;
    const pth = '';

    afterAll(() => setTimeout(() => process.exit(), 1000));
    beforeEach(async () => {
        mockedWeb3 = new Web3(new Web3.providers.WebsocketProvider(testUrl));
        mockedContract = new mockedWeb3.eth.Contract([]);
        mockedContract.options.address = testAddress;
    });

    describe('check mockedContract', () => {
        it('should return contract address', async () => {
            expect(mockedContract.options.address).toBe(testAddress);
        });
    });

    describe('dependency resolve', () => {
        it('should be defined', async () => {
            const module: TestingModule = await Test.createTestingModule({
                providers: [EventService],
                imports: [
                    Web3Module, ConfigModule.load(path.resolve(pth + '/test/socket', 'config', '**/!(*.d).{ts,js}')),
                    ContractFactoryModule, AbiModule,
                ],
            }).compile();
            service = module.get<EventService>(EventService);

            expect(service).toBeDefined();
        });
    });

    describe('#getEvents()', () => {
        it('should return expectedEvent', async () => {
            const module: TestingModule = await Test.createTestingModule({
                providers: [EventService],
                imports: [
                    Web3Module, ConfigModule.load(path.resolve(pth + '/test/socket', 'config', '**/!(*.d).{ts,js}')),
                    ContractFactoryModule, AbiModule,
                ],
            }).compile();
            service = module.get<EventService>(EventService);
            const testEvent: EventList = EventList.NewToken;
            expect(await mockedEventService.getEvents(testEvent)).toBeDefined();
        });
    });
});
