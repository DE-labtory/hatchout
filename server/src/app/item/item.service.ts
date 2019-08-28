import {Item} from '../../domain/item/item.entity';
import {DeleteResult, UpdateResult} from 'typeorm';
import {ItemDto} from './dto/item.dto';

export interface IItemService {
    create(itemDto: ItemDto): Promise<Item>;
    get(id: number): Promise<Item>;
    updatePrice(id: number, price: number): Promise<UpdateResult>;
    updateDetail(id: number, detail: string): Promise<UpdateResult>;
    delete(id: number): Promise<DeleteResult>;
}
