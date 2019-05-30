import {Test, TestingModule} from '@nestjs/testing';
import {AbiConfig} from './abi.config';
import {ConfigModule} from 'nestjs-config';
import {Web3Module} from '../web3.module';
import * as path from 'path';

describe('AbiProvider', () => {
    let abi: AbiConfig;
    const pth = '/Users/Kyudong/Desktop/hatchout/hatchout/server/src/port/adapter/service/blockchain/ethereum/web3';

    afterAll(() => setTimeout(() => process.exit(), 1000));
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AbiConfig],
            imports: [
                Web3Module, ConfigModule.load(path.resolve(pth + '/test/socket', 'config', '**/!(*.d).{ts,js}')),
            ],
        }).compile();
        abi = module.get<AbiConfig>(AbiConfig);
    });
    it('#getGhostAbi()', () => {
        const testAbi = [{
            test: 'test',
        }];

        const provider = abi.getGhostAbi();
        expect(provider.valueOf()).toEqual(testAbi);
    });
});
