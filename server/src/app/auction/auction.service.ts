import {Injectable} from '@nestjs/common';
import {IAuctionRepository} from '../../domain/auction/auction.repository';
import {Auction, AuctionType} from '../../domain/auction/auction.entity';
import {AuctionDto} from './dto/auction.dto';

@Injectable()
export class AuctionService {
    constructor(private readonly auctionRepository: IAuctionRepository) {
    }

    async findOne(id: number): Promise<Auction> {
        return await this.auctionRepository.findOne(id);
    }

    async createAuction(auctionDto: AuctionDto): Promise<Auction> {
        let newAuction;
        if (auctionDto.type === AuctionType.SALE_AUCTION) {
            // tslint:disable-next-line:max-line-length
            newAuction = new Auction(auctionDto.gene, auctionDto.seller, auctionDto.duration, auctionDto.type, auctionDto.winner, auctionDto.bidAmount);
        } else {
            newAuction = new Auction(auctionDto.gene, auctionDto.seller, auctionDto.duration, auctionDto.type);
        }
        return await this.auctionRepository.save(newAuction);
    }

    async updateWinner(gene: string, winner: string, bidAmount: number): Promise<Auction> {
        const auction = await this.auctionRepository.findOne(
            {
                gene,
            },
        );
        auction.setWinnerId(winner);
        auction.setBidAmount(bidAmount);
        return await this.auctionRepository.save(auction);
    }

    async cancelAuction(gene: string): Promise<Auction> {
        const auction = await this.auctionRepository.findOne(
            {
                gene,
            },
        );
        auction.cancel();
        return await this.auctionRepository.save(auction);
    }

    async endAuction(gene: string): Promise<Auction> {
        const auction = await this.auctionRepository.findOne(
            {
                gene,
            },
        );
        auction.finish();
        return await this.auctionRepository.save(auction);
    }
}
