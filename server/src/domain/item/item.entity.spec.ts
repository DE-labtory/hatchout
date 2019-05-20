import {Item} from './item.entity';

describe('ItemEntity', () => {
    const name = 'item';
    const price = 9900;
    const detail = 'this is item';
    let item: Item = new Item(name, price);

    describe('#constructor()', () => {
        it('should be defined with name and price', async () => {
            await expect(item).toBeDefined();
        });

        it('should be defined with name, price and detail', async () => {
            item = new Item(name, price, detail);

            await expect(item).toBeDefined();
        });
    });

    describe('#getPrice()',  () => {
        it('should return price', async  () => {
           await expect(item.getPrice()).toBe(price);
        });
    });
    describe('#getDetail()',  () => {
        it('should return detail', async () => {
            item = new Item(name, price, detail);

            await expect(item.getDetail()).toBe(detail);
        });
    });

    describe('#setPrice()',  () => {
        it('should return new price', async () => {
            // given
            const newPrice = 19900;

            // when
            item.setPrice(newPrice);

            // then
            await expect(item.getPrice()).toBe(newPrice);
        });
    });
    describe('#setDetail()',  () => {
        it('should return new detail', async () => {
            // given
            const newDetail = 'this is new detail';

            // when
            item.setDetail(newDetail);

            // then
            await expect(item.getDetail()).toBe(newDetail);
        });
    });
});
