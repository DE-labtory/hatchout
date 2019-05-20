import {EntityRepository, Repository} from 'typeorm';
import {IItemRepository} from '../../../domain/item/item.repository';
import {Item} from '../../../domain/item/item.entity';

@EntityRepository(Item)
export class ItemRepository extends Repository<Item> implements IItemRepository {
    async findById(id: number): Promise<Item> {
        return await this.findOne(id);
    }

    async findByName(name: string): Promise<Item> {
        return await this.findOne({name});
    }
}
