import {Inject, Injectable} from '@nestjs/common';
import {IItemService} from './item.service';
import {IItemRepository} from '../../domain/item/item.repository';
import {Item} from '../../domain/item/item.entity';
import {DeleteResult, UpdateResult} from 'typeorm';
import {ItemDto} from './dto/item.dto';

@Injectable()
export class ItemService implements IItemService {
    constructor(@Inject('IItemRepository') private itemRepository: IItemRepository) {}

    async create(itemDto: ItemDto): Promise<Item> {
        if (itemDto.name === undefined) {
            throw new Error('name should be defined');
        }

        if (itemDto.price === undefined) {
            throw new Error('price should be defined');
        }

        const itemRetrieved = await this.itemRepository.findByName(itemDto.name);
        if (itemRetrieved !== undefined) {
            throw new Error('name is already registered');
        }

        const item = new Item(itemDto.name, itemDto.price, itemDto.detail);
        return await this.itemRepository.save(item);
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.itemRepository.delete(id);
    }

    async get(id: number): Promise<Item> {
        return await this.itemRepository.findById(id);
    }

    async updateDetail(id: number, detail: string): Promise<UpdateResult> {
        const item: Item = await this.itemRepository.findById(id);
        if (item === undefined) {
            throw new Error('item with ID is not found');
        }

        item.setDetail(detail);
        return await this.itemRepository.update(id, item);
    }

    async updatePrice(id: number, price: number): Promise<UpdateResult> {
        const item: Item = await this.itemRepository.findById(id);
        if (item === undefined) {
            throw new Error('item with ID is not found');
        }

        item.setPrice(price);
        return await this.itemRepository.update(id, item);
    }

}
