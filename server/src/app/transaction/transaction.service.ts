import {Transaction} from '../../domain/transaction/transaction.entity';
import {CreateTransactionRequest} from './request/create-transaction.request';

export interface ITransactionService {
    create(newTransactionRequest: CreateTransactionRequest): Promise<Transaction>;
    get(txHash: string): Promise<Transaction>;
    getAll(page: number): Promise<Transaction[]>;
}
