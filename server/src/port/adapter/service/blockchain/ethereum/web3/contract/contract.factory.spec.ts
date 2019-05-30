import {Test, TestingModule} from '@nestjs/testing';
import * as path from 'path';
import {ConfigModule} from 'nestjs-config';
import {ContractFactory} from './contract.factory';
import {Web3Module} from '../web3.module';
import {EventList} from '../../event/list/event';
import {AbiModule} from '../abi/abi.module';

describe('ContractProvider', () => {
    let contractFactory: ContractFactory;
    const pth = '/Users/Kyudong/Desktop/hatchout/hatchout/server/src/port/adapter/service/blockchain/ethereum/web3';

    afterAll(() => setTimeout(() => process.exit(), 1000));
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ContractFactory],
            imports: [
                Web3Module, ConfigModule.load(path.resolve(pth + '/test/socket', 'config', '**/!(*.d).{ts,js}')),
                AbiModule,
            ],
        }).compile();
        contractFactory = module.get<ContractFactory>(ContractFactory);
    });

    describe('#getInstance()', () => {
        it('should return specific Contract', async () => {
            const event = EventList.AuctionCreated;
            const fac = contractFactory.getInstance(event);
            expect(fac).toBeDefined();
        });
    });
});
