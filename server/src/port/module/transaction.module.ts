import {Module} from '@nestjs/common';
import {TransactionService} from '../../app/transaction/transaction.service.impl';
import {TransactionController} from '../../web/transaction/transaction.contoller';

@Module({
    controllers: [TransactionController],
    providers: [
        {
            provide: 'TransactionService',
            useClass: TransactionService,
        },
    ],
})
export class TransactionModule {
}
