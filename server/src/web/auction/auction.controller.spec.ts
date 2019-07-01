import {AuctionService} from '../../app/auction/auction.service';
import {instance, mock, when} from 'ts-mockito';
import {AuctionController} from './auction.controller';
import {Auction, AuctionType} from '../../domain/auction/auction.entity';
import {Test, TestingModule} from '@nestjs/testing';

describe('Auction Controller', () => {
    const mockAuctionService = mock(AuctionService);
    let controller: AuctionController;
    let saleAuction: Auction;
    let specialAuction: Auction;

    beforeEach(() => {
        saleAuction = new Auction(
            'AA239BE27',
            'user1',
            60,
            AuctionType.SALE_AUCTION,
            'user3',
            2000,
        );

        specialAuction = new Auction(
            'EB2820AC1',
            'user2',
            120,
            AuctionType.SPECIAL_AUCTION,
        );
    });

    describe('dependency resolve', () => {
        it('should be defined', async () => {
            const module: TestingModule = await Test.createTestingModule({
                controllers: [AuctionController],
                providers: [{
                    provide: 'AuctionService',
                    useValue: instance(mockAuctionService),
                }],
            }).compile();

            controller = module.get<AuctionController>(AuctionController);
            expect(controller).toBeDefined();
        });
    });

    describe('#findOne()', () => {
        it('should find one auction', async () => {
            when(mockAuctionService.findOne(1)).thenReturn(new Promise((resolve) => {
                resolve(saleAuction);
            }));
            controller = new AuctionController(instance(mockAuctionService));

            expect(await controller.findOne(1)).toBe(saleAuction);
        });
    });

    describe('#findOneByGene()', () => {
        it('should find one auction by gene', async () => {
            when(mockAuctionService.findOneByGene('AA239BE27')).thenReturn(new Promise((resolve) => {
                resolve(saleAuction);
            }));
            controller = new AuctionController(instance(mockAuctionService));

            expect(await controller.findOneByGene('AA239BE27')).toBe(saleAuction);
        });
    });
});
