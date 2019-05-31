import {ItemService} from '../../app/item/item.service.impl';
import {ItemRepository} from '../persistence/repository/item.repository.impl';
import {Module} from '@nestjs/common';

@Module({
    providers: [
        {
            provide: 'IItemService',
            useClass: ItemService,
        },
        {
            provide: 'IItemRepository',
            useClass: ItemRepository,
        },
    ],
})
export class ItemModule {}
