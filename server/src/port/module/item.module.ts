import {ItemService} from '../../app/item/item.service.impl';
import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ItemRepository} from '../persistence/repository/item.repository.impl';

@Module({
    imports: [
        TypeOrmModule.forFeature([ItemRepository]),
    ],
    providers: [
        {
            provide: 'ItemService',
            useClass: ItemService,
        },
    ],
})
export class ItemModule {}
