import {Transaction} from '../../../domain/transaction/transaction.entity';
import {FindManyOptions} from 'typeorm';

export interface ITransactionRepository {
    find(options?: FindManyOptions<Transaction>): Promise<Transaction[]>;
    findOne(txHash: string): Promise<Transaction>;
    save(entity: Transaction): Promise<Transaction>;
}
