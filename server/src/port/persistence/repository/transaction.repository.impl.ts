import {EntityRepository, Repository} from 'typeorm';
import {Transaction} from '../../../domain/transaction/transaction.entity';
import {ITransactionRepository} from './transaction.repository';

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> implements ITransactionRepository {}
