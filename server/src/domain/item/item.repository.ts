import {Item} from './item.entity';
import {DeleteResult, UpdateResult} from 'typeorm';

export interface IItemRepository {
    save(entity: Item): Promise<Item>;
    findById(id: number): Promise<Item>;
    findByName(name: string): Promise<Item>;
    update(criteria: number, entity: Item): Promise<UpdateResult>;
    delete(criteria: number): Promise<DeleteResult>;
}
