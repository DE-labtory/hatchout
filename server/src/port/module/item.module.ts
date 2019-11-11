import {ItemService} from '../../app/item/item.service.impl';
import {Module} from '@nestjs/common';

@Module({
    providers: [
        {
            provide: 'ItemService',
            useClass: ItemService,
        },
    ],
})
export class ItemModule {}
