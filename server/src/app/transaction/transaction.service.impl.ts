import {ITransactionService} from './transaction.service';
import {Inject, Injectable} from '@nestjs/common';
import {Transaction} from '../../domain/transaction/transaction.entity';
import {CreateTransactionDto} from './dto/create-transaction.dto';
import {ITransactionRepository} from '../../domain/transaction/transaction.repository';

@Injectable()
export class TransactionService implements ITransactionService {
    constructor(@Inject('ITransactionRepository') private TransactionRepository: ITransactionRepository) {}

    async create(newTransactionRequest: CreateTransactionDto): Promise<Transaction> {
        const newTxHash = newTransactionRequest.txHash;

        if (newTxHash === undefined) {
            throw new Error('txHash should be defined');
        }

        const txRetrieved = await this.TransactionRepository.findOne(newTxHash);
        if (txRetrieved !== undefined) {
            throw new Error('txHash is already registered');
        }

        const newTx = new Transaction(
            newTransactionRequest.blockHash,
            newTransactionRequest.blockNumber,
            newTransactionRequest.txHash,
            newTransactionRequest.txIndex,
            newTransactionRequest.from,
            newTransactionRequest.to,
            newTransactionRequest.contractAddress,
            newTransactionRequest.status,
        );
        return await this.TransactionRepository.save(newTx);
    }

    async get(txHash: string): Promise<Transaction> {
        return await this.TransactionRepository.findOne(txHash);
    }

    async getAll(page: number): Promise<Transaction[]> {
        return await this.TransactionRepository.find({
            take: 25,
            skip: 25 * (page - 1),
        });
    }
}
