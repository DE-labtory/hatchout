import {FindManyOptions} from 'typeorm';
import {Transaction} from './transaction.entity';

export interface ITransactionRepository {
    find(options?: FindManyOptions<Transaction>): Promise<Transaction[]>;
    findOne(txHash: string): Promise<Transaction>;
    save(entity: Transaction): Promise<Transaction>;
}
