import {Test, TestingModule} from '@nestjs/testing';
import * as path from 'path';
import {ConfigModule} from 'nestjs-config';
import {ContractFactory} from './contract.factory';
import {Web3Module} from '../web3.module';
import Web3 from 'web3';

describe('ContractFactory', () => {
    let contractFactory: ContractFactory;
    let web3: Web3;

    afterAll(() => setTimeout(() => process.exit(), 1000));
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ContractFactory],
            imports: [
                Web3Module, ConfigModule.load(path.resolve(__dirname + '/test/socket', 'config', '**/!(*.d).{ts,js}')),
            ],
        }).compile();
        contractFactory = module.get<ContractFactory>(ContractFactory);
        web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'));
    });

    describe('#getContract()', () => {
        it('should return specific Contract', async () => {
        });
    });
});
