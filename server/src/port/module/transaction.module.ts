import {Module} from '@nestjs/common';
import {TransactionService} from '../../app/transaction/transaction.service.impl';
import {TransactionRepository} from '../persistence/repository/transaction.repository.impl';

@Module({
    providers: [
        {
            provide: 'ITransactionService',
            useClass: TransactionService,
        },
        {
            provide: 'ITransactionRepository',
            useClass: TransactionRepository,
        },
    ],
})
export class TransactionModule {
}
