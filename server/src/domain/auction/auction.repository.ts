import {Auction} from './auction.entity';
import {FindConditions, FindOneOptions} from 'typeorm';

export interface IAuctionRepository {
    findOne(id?: number): Promise<Auction | undefined>;
    findOne(conditions?: FindConditions<Auction>, options?: FindOneOptions<Auction>): Promise<Auction | undefined>;
    save(entity: Auction): Promise<Auction>;
    find(options?: FindConditions<Auction>): Promise<Auction[]>;
}
