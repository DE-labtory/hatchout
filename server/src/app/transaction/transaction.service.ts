import {Transaction} from '../../domain/transaction/transaction.entity';
import {CreateTransactionDto} from './dto/create-transaction.dto';

export interface ITransactionService {
    create(newTransactionRequest: CreateTransactionDto): Promise<Transaction>;
    get(txHash: string): Promise<Transaction>;
    getAll(page: number): Promise<Transaction[]>;
}
