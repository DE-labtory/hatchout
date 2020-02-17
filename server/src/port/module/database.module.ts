import {Global, Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RepositoryConfigService} from '../persistence/repository/repository.config.service';
import {UserRepository} from '../persistence/repository/user.repository.impl';
import {GhostRepository} from '../persistence/repository/ghost.repository.impl';
import {ItemRepository} from '../persistence/repository/item.repository.impl';
import {TransactionRepository} from '../persistence/repository/transaction.repository.impl';

@Global()
@Module({
    imports: [
      TypeOrmModule.forFeature([UserRepository, GhostRepository, ItemRepository, TransactionRepository]),
      TypeOrmModule.forRootAsync({
          useClass: RepositoryConfigService,
      }),
    ],
  exports:  [
    TypeOrmModule,
  ],
})
export class DatabaseModule {}
