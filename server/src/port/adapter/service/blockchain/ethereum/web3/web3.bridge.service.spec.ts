import {Test, TestingModule} from '@nestjs/testing';
import {Web3BridgeService} from './web3.bridge.service';
import Web3 from 'web3';
import {Web3Module} from './web3.module';
import {ConfigModule} from 'nestjs-config';
import * as path from 'path';
import {Account, Sign} from 'web3-eth-accounts';

describe('Web3BrdigeService', () => {

    let service: Web3BridgeService;
    let web3: Web3;

    beforeAll( async () => {
        const module = await Test.createTestingModule({
            imports: [
                Web3Module,
                ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
            ],
            providers: [
                Web3BridgeService,
            ],
        }).compile();

        web3 = module.get<Web3>('WEB3');
        service = module.get<Web3BridgeService>(Web3BridgeService);
    });

    describe('dependency resolve', () => {
        it('should be defined', async () => {
            expect(service).toBeDefined();
        });
    });
    describe('#recover()', () => {
        let account: Account;
        let sign: Sign;
        const message = 'data';
        const wrongMessage = 'wrongData';

        beforeAll(() => {
            account = web3.eth.accounts.create();
        });

        it('should return address', () => {
            sign = web3.eth.accounts.sign(message, account.privateKey);
            service = new Web3BridgeService(web3);

            expect(service.recover(sign.message, sign.signature)).toBe(account.address);
        });
        it('should return wrong address', () => {
            sign = web3.eth.accounts.sign(message, account.privateKey);
            service = new Web3BridgeService(web3);

            expect(service.recover(wrongMessage, sign.signature)).not.toBe(account.address);
        });
    });
    },
);
