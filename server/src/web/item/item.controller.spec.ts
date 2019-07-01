import {ItemController} from './item.controller';
import {ItemService} from '../../app/item/item.service.impl';
import {anything, instance, mock, when} from 'ts-mockito';
import {Item} from '../../domain/item/item.entity';
import {Test, TestingModule} from '@nestjs/testing';
import {ItemDto} from '../../app/item/dto/item.dto';

describe('Item Controller', () => {
    const mockItemService = mock(ItemService);
    let controller: ItemController;
    let item: Item;

    beforeEach(() => {
        item = new Item(
            'item1',
            20000,
            'example of item',
        );
    });

    describe('dependency resolve', () => {
        it('should be defined', async () => {
            const module: TestingModule = await Test.createTestingModule({
                controllers: [ItemController],
                providers: [{
                    provide: 'ItemService',
                    useValue: instance(mockItemService),
                }],
            }).compile();

            controller = module.get<ItemController>(ItemController);
            expect(controller).toBeDefined();
        });
    });

    describe('#create()', () => {
        let itemDto: ItemDto;

        it('should return item', async () => {
            itemDto = new ItemDto(
                'item1',
                20000,
                'example of item',
            );

            when(mockItemService.create(itemDto)).thenReturn(new Promise((resolve) => {
                resolve(item);
            }));
            controller = new ItemController(instance(mockItemService));

            expect(await controller.create(itemDto)).toBe(item);
        });
    });

    describe('#delete()', () => {
        it('should return deleted item', async () => {
            when(mockItemService.delete(1)).thenReturn(new Promise((resolve) => {
                resolve({
                    raw: anything(),
                    affected: 1,
                });
            }));
            controller = new ItemController(instance(mockItemService));

            expect(await controller.delete(1)).toBeDefined();
        });
    });

    describe('#get()', () => {
        it('should return item', async () => {
            when(mockItemService.get(1)).thenReturn(new Promise((resolve) => {
                resolve(item);
            }));
            controller = new ItemController(instance(mockItemService));

            expect(await controller.get(1)).toBe(item);
        });
    });

    describe('#updateDetail()', () => {
        it('should return item with updated detail', async () => {
            when(mockItemService.updateDetail(1, 'this new detail')).thenReturn(new Promise((resolve) => {
                resolve({
                    raw: anything(),
                    generatedMaps: [],
                });
            }));
            controller = new ItemController(instance(mockItemService));

            expect(await controller.updateDetail(1, 'this new detail')).toBeDefined();
        });
    });

    describe('#updatePrice', () => {
        it('should return item with updated price', async () => {
            when(mockItemService.updatePrice(1, 19900)).thenReturn(new Promise((resolve) => {
                resolve({
                    raw: anything(),
                    generatedMaps: [],
                });
            }));
            controller = new ItemController(instance(mockItemService));

            expect(await controller.updatePrice(1, 19900)).toBeDefined();
        });
    });
});
