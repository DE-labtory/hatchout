import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RepositoryConfigService} from '../persistence/repository/repository.config.service';
import {UserRepository} from '../persistence/repository/user.repository.impl';
import {GhostRepository} from '../persistence/repository/ghost.repository.impl';
import {TransactionRepository} from '../persistence/repository/transaction.repository.impl';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useClass: RepositoryConfigService,
        }),
        TypeOrmModule.forFeature([
            UserRepository,
            GhostRepository,
            TransactionRepository,
        ]),
    ],
})
export class DatabaseModule {}
