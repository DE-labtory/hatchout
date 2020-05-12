import {Inject, Injectable} from '@nestjs/common';
import {EventHandler} from './event.handler';
import {AuctionService} from '../../../../../../../app/auction/auction.service';
import {EventData} from 'web3-eth-contract';
import {AuctionDto} from '../../../../../../../app/auction/dto/auction.dto';

@Injectable()
export class AuctionHandler implements EventHandler {
    constructor(@Inject('AuctionService') private auctionService: AuctionService) {
    }

    public async callService(eventData: EventData[]): Promise<void> {
        for (const data of eventData) {
            if (data.event === 'AuctionCreated') {
                await this.createAuction(data);
            }
            if (data.event === 'AuctionSuccessful') {
                await this.updateWinner(data);
            }
            if (data.event === 'AuctionCancelled') {
                await this.cancelAuction(data);
            }
            // if (data.event === 'AuctionEnded') {
            //     await this.endAuction(data);
            // }
        }
    }

    async createAuction(event: EventData): Promise<void> {
        const {
            gene,
            seller,
            duration,
            type,
            winner,
            bidAmount,
        } = event.returnValues;
        await this.auctionService.createAuction(new AuctionDto(gene, seller, duration, type, winner, bidAmount));
    }

    async updateWinner(event: EventData): Promise<void> {
        const {
            gene,
            winner,
            bidAmount,
        } = event.returnValues;
        await this.auctionService.updateWinner(gene, winner, bidAmount);
    }

    async cancelAuction(event: EventData): Promise<void> {
        const { gene } = event.returnValues;
        await this.auctionService.cancelAuction(gene);
    }

    async endAuction(event: EventData): Promise<void> {
        const gene = event.returnValues.gene;
        await this.auctionService.endAuction(gene);
    }
}
