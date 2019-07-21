import {AuctionService} from './auction.service';
import {Auction, AuctionEndType, AuctionType} from '../../domain/auction/auction.entity';
import {IAuctionRepository} from '../../domain/auction/auction.repository';
import {AuctionRepository} from '../../port/persistence/repository/auction.repository.impl';
import {mock, when, instance, objectContaining} from 'ts-mockito';
import {AuctionDto} from './dto/auction.dto';

describe('AuctionService', () => {
    // tslint:disable-next-line:prefer-const
    let service: AuctionService;
    const mockSaleAuction: Auction = new Auction(
        'AA239BE27',
        1,
        'user1',
        60,
        AuctionType.SALE_AUCTION,
        'user3',
        2000,
    );

    const mockSpecialAuction: Auction = new Auction(
        'EB2820AC1',
        2,
        'user2',
        120,
        AuctionType.SPECIAL_AUCTION,
    );

    describe('#findOne()', async () => {
        const repository: AuctionRepository = mock(AuctionRepository);

        it('should find one auction', async () => {
            when(repository.findOne(0)).thenReturn(new Promise((res) => {
                res(mockSaleAuction);
            }));
            const repositoryImpl: IAuctionRepository = instance(repository);

            service = new AuctionService(repositoryImpl);
            const auction = await service.findOne(0);
            expect(auction).toEqual(mockSaleAuction);
        });
    });

    describe('#findOneByTokenId()', async () => {
        const repository: AuctionRepository = mock(AuctionRepository);

        it('should find one auction by gene', async () => {
            const option = {
                tokenId: 2,
            };

            when(repository.findOne(objectContaining(option))).thenReturn(new Promise((res) => {
                res(mockSpecialAuction);
            }));
            const repositoryImpl: IAuctionRepository = instance(repository);

            service = new AuctionService(repositoryImpl);
            const auction = await service.findOneByTokenId(2);
            expect(auction).toEqual(mockSpecialAuction);
        });
    });

    describe('#createAuction()', async () => {
        const repository: AuctionRepository = mock(AuctionRepository);
        let auctionDto: AuctionDto;

        it('should create sale auction', async () => {
            when(repository.findOne(0)).thenReturn(new Promise((res) => {
                res(mockSaleAuction);
            }));

            const repositoryImpl: IAuctionRepository = instance(repository);

            auctionDto = new AuctionDto(
                'AA239BE27',
                1,
                'user1',
                60,
                AuctionType.SALE_AUCTION,
                'user3',
                2000,
            );

            service = new AuctionService(repositoryImpl);
            await service.createAuction(auctionDto);

            const auction = await service.findOne(0);
            expect(auction).toEqual(mockSaleAuction);
        });

        it('should create special auction', async () => {
            when(repository.findOne(1)).thenReturn(new Promise((res) => {
                res(mockSpecialAuction);
            }));

            const repositoryImpl: IAuctionRepository = instance(repository);

            auctionDto = new AuctionDto(
                'EB2820AC1',
                2,
                'user2',
                120,
                AuctionType.SPECIAL_AUCTION,
            );

            service = new AuctionService(repositoryImpl);
            await service.createAuction(auctionDto);

            const auction = await service.findOne(1);
            expect(auction).toEqual(mockSpecialAuction);
        });
    });

    describe('#updateWinner()', async () => {
        const repository: AuctionRepository = mock(AuctionRepository);

        it('should update winner of this auction', async () => {
            when(repository.findOne(1)).thenReturn(new Promise((res) => {
                res(mockSpecialAuction);
            }));

            const option = {
                tokenId: 2,
            };

            when(repository.findOne(objectContaining(option))).thenReturn(new Promise((res) => {
                res(mockSpecialAuction);
            }));

            const repositoryImpl: IAuctionRepository = instance(repository);

            service = new AuctionService(repositoryImpl);
            await service.updateWinner(2, 'user4', 5000);

            const auction = await service.findOne(1);
            expect(auction.winnerId).toEqual('user4');
        });
    });

    describe('#cancelAuction()', async () => {
        const repository: AuctionRepository = mock(AuctionRepository);

        it('should cancel auction', async () => {
            when(repository.findOne(1)).thenReturn(new Promise((res) => {
                res(mockSpecialAuction);
            }));

            const option = {
                tokenId: 2,
            };

            when(repository.findOne(objectContaining(option))).thenReturn(new Promise((res) => {
                res(mockSpecialAuction);
            }));

            const repositoryImpl: IAuctionRepository = instance(repository);

            service = new AuctionService(repositoryImpl);
            await service.cancelAuction(2);

            const auction = await service.findOne(1);
            expect(auction.endType).toEqual(AuctionEndType.CANCEL);
        });
    });

    describe('#endAuction()', async () => {
        const repository: AuctionRepository = mock(AuctionRepository);

        it('should finish auction', async () => {
            when(repository.findOne(1)).thenReturn(new Promise((res) => {
                res(mockSpecialAuction);
            }));

            const option = {
                tokenId: 2,
            };

            when(repository.findOne(objectContaining(option))).thenReturn(new Promise((res) => {
                res(mockSpecialAuction);
            }));

            const repositoryImpl: IAuctionRepository = instance(repository);

            service = new AuctionService(repositoryImpl);
            await service.endAuction(2);

            const auction = await service.findOne(1);
            expect(auction.endType).toEqual(AuctionEndType.SUCCESS);
        });
    });
});
