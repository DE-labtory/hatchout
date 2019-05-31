import {ItemRepository} from '../../port/persistence/repository/item.repository.impl';
import {mock, instance, when, anything} from 'ts-mockito';
import {Item} from '../../domain/item/item.entity';
import {ItemService} from './item.service.impl';
import {TestingModule, Test} from '@nestjs/testing';
import {ItemDto} from './dto/item.dto';

describe('ItemService', () => {
    const name = 'item name';
    const price = 9900;
    const detail = 'this is item';

    const mockRepository = mock(ItemRepository);
    const item: Item = new Item(name, price, detail);
    let service: ItemService;

    describe('dependency resolve', () => {
        it('should be defined', async () => {
            // given
            const module: TestingModule = await Test.createTestingModule({
                providers: [
                    ItemService,
                    {
                        provide: 'IItemRepository',
                        useValue: instance(mockRepository),
                    },
                ],
            }).compile();

            // when
            service = module.get<ItemService>(ItemService);

            // then
            expect(service).toBeDefined();
        });
    });

    describe('#create()', () => {
        let itemDto: ItemDto;

        it('should return item', async () => {
            when(mockRepository.findByName(name)).thenReturn(undefined);
            when(mockRepository.save(anything())).thenReturn(new Promise(resolve => {
                resolve(item);
            }));
            service = new ItemService(instance(mockRepository));
            itemDto = new ItemDto(name, price, detail);

            expect(await service.create(itemDto)).toBe(item);
        });

        it('should throw "name should be defined"', async () => {
            when(mockRepository.findByName(name)).thenReturn(new Promise(resolve => {
                resolve(item);
            }));
            service = new ItemService(instance(mockRepository));
            itemDto = new ItemDto();

            await expect(service.create(itemDto))
                .rejects
                .toThrowError('name should be defined');
        });

        it('should throw "price should be defined"', async () => {
            when(mockRepository.findByName(name)).thenReturn(new Promise(resolve => {
                resolve(item);
            }));
            service = new ItemService(instance(mockRepository));
            itemDto = new ItemDto(name);

            await expect(service.create(itemDto))
                .rejects
                .toThrowError('price should be defined');
        });

        it('should throw "name is already registered"', async () => {
            when(mockRepository.findByName(name)).thenReturn(new Promise(resolve => {
                resolve(item);
            }));
            service = new ItemService(instance(mockRepository));
            itemDto = new ItemDto(name, price, detail);

            await expect(service.create(itemDto))
                .rejects
                .toThrowError('name is already registered');
        });
    });

    describe('#get()', () => {
        let id: number;

        it('should return item', async () => {
            id = 1;
            when(mockRepository.findById(id)).thenReturn(new Promise(resolve => {
                resolve(item);
            }));
            service = new ItemService(instance(mockRepository));

            expect(await service.get(id)).toBe(item);
        });

        it('should return undefined', async () => {
            id = 2;
            when(mockRepository.findById(id)).thenReturn(undefined);
            service = new ItemService(instance(mockRepository));

            expect(await service.get(id)).toBeUndefined();
        });
    });

    describe('#updatePrice()', () => {
        let id: number;
        const newPrice: number = 19900;
        const updatedItem: Item = new Item(name, newPrice, detail);

        it('should return item with updated price', async () => {
            id = 1;
            when(mockRepository.findById(id)).thenReturn(new Promise(resolve => {
                resolve(item);
            }));
            when(mockRepository.update(id, updatedItem)).thenReturn(new Promise(resolve => {
                resolve({
                    raw: anything(),
                    generatedMaps: [],
                });
            }));
            service = new ItemService(instance(mockRepository));

            expect(await service.updatePrice(id, newPrice)).toBeDefined();
        });

        it('should throw error "item with ID is not found"', async () => {
            id = 2;
            when(mockRepository.findById(id)).thenReturn(undefined);
            service = new ItemService(instance(mockRepository));

            await expect(service.updatePrice(id, newPrice))
                .rejects
                .toThrowError('item with ID is not found');
        });
    });

    describe('#updateDetail()', () => {
        let id: number;
        const newDetail: string = 'this is new detail';
        const updatedItem: Item = new Item(name, price, newDetail);

        it('should return item with updated detail', async () => {
            id = 1;
            when(mockRepository.findById(id)).thenReturn(new Promise(resolve => {
                resolve(item);
            }));
            when(mockRepository.update(id, updatedItem)).thenReturn(new Promise(resolve => {
                resolve({
                    raw: anything(),
                    generatedMaps: [],
                });
            }));
            service = new ItemService(instance(mockRepository));

            expect(await service.updateDetail(id, newDetail)).toBeDefined();
        });

        it('should throw error "item with ID is not found"', async () => {
            id = 2;
            when(mockRepository.findById(id)).thenReturn(undefined);
            service = new ItemService(instance(mockRepository));

            await expect(service.updateDetail(id, newDetail))
                .rejects
                .toThrowError('item with ID is not found');
        });
    });

    describe('#delete()', () => {
        let id: number;

        it('should return deleted item', async () => {
            id = 1;
            when(mockRepository.delete(id)).thenReturn(new Promise(resolve => {
                resolve({
                    raw: anything(),
                    affected: 1,
                });
            }));
            service = new ItemService(instance(mockRepository));

            expect(await service.delete(id)).toBeDefined();
        });

        it('should return undefined', async () => {
            id = 2;
            when(mockRepository.delete(id)).thenReturn(undefined);
            service = new ItemService(instance(mockRepository));

            expect(await service.delete(id)).toBeUndefined();
        });
    });
});
