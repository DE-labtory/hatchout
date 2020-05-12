import {Test} from '@nestjs/testing';
import {ConfigModule} from 'nestjs-config';
import * as path from 'path';
import {Web3Module} from '../web3/web3.module';
import {instance, mock} from 'ts-mockito';
import {AuctionHandler} from '../event/handler/auction.event.handler';
import {AuctionContractService} from './auction.contract.service';

describe('AuctionContractService', () => {
        let auctionContractService: AuctionContractService;
        const mockAuctionEventHandler = mock(AuctionHandler);

        beforeAll( async () => {
            const module = await Test.createTestingModule({
                imports: [
                    Web3Module,
                    ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
                ],
                providers: [
                    AuctionContractService,
                    {
                        provide: 'AuctionHandler',
                        useValue: instance(mockAuctionEventHandler),
                    },
                ],
            }).compile();
            auctionContractService = module.get<AuctionContractService>(AuctionContractService);
        });
        describe('#watchAuctionEvents()', () => {
            it('should check blockNum increase by one', async () => {
                await auctionContractService.watchAuctionEvents();
            });
        });
    },
);
