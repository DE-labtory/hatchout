import {EntityRepository, Repository} from 'typeorm';
import {Auction} from '../../../domain/auction/auction.entity';
import {IAuctionRepository} from '../../../domain/auction/auction.repository';

@EntityRepository(Auction)
export class AuctionRepository extends Repository<Auction> implements IAuctionRepository {}
