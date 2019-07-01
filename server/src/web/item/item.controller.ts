import {ItemService} from '../../app/item/item.service.impl';
import {ItemDto} from '../../app/item/dto/item.dto';
import {Item} from '../../domain/item/item.entity';
import {DeleteResult, UpdateResult} from 'typeorm';
import {Body, Controller, Delete, Get, Inject, Injectable, Param, Post, Put} from '@nestjs/common';

@Injectable()
@Controller('item')
export class ItemController {
    constructor(@Inject('ItemService') private service: ItemService) {}

    @Post()
    async create(@Body() itemDto: ItemDto): Promise<Item> {
        return await this.service.create(itemDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<DeleteResult> {
        return await this.service.delete(id);
    }

    @Get(':id')
    async get(@Param('id') id: number): Promise<Item> {
        return await this.service.get(id);
    }

    @Put(':id/update-detail')
    async updateDetail(@Param('id') id: number, @Param('detail') detail: string): Promise<UpdateResult> {
        return await this.service.updateDetail(id, detail);
    }

    @Put(':id/update-price')
    async updatePrice(@Param('id') id: number, @Param('price') price: number): Promise<UpdateResult> {
        return await this.service.updatePrice(id, price);
    }
}
