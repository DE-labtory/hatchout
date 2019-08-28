import {EntityRepository, Repository} from 'typeorm';
import {Transaction} from '../../../domain/transaction/transaction.entity';
import {ITransactionRepository} from '../../../domain/transaction/transaction.repository';

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> implements ITransactionRepository {}
