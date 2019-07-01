import {Controller, Get, Inject, Injectable, Param, Query} from '@nestjs/common';
import {AuctionService} from '../../app/auction/auction.service';
import {Auction} from '../../domain/auction/auction.entity';

@Injectable()
@Controller('auction')
export class AuctionController {
    constructor(@Inject('AuctionService') private service: AuctionService) {}

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Auction> {
        return await this.service.findOne(id);
    }

    @Get()
    async findOneByGene(@Query('gene') gene): Promise<Auction> {
        return await this.service.findOneByGene(gene);
    }
}
