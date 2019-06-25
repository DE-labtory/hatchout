import {Module} from '@nestjs/common';
import {TransactionService} from '../../app/transaction/transaction.service.impl';
import {TransactionController} from '../../web/transaction/transaction.contoller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {TransactionRepository} from '../persistence/repository/transaction.repository.impl';

@Module({
    imports: [
        TypeOrmModule.forFeature([TransactionRepository]),
    ],
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
