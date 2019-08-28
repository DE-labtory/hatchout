import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {RepositoryConfigService} from '../persistence/repository/repository.config.service';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useClass: RepositoryConfigService,
        }),
    ],
})
export class DatabaseModule {}
