import { User} from './user.entity';

describe('User.Entity', () => {
    const address = 'testAddress';
    const name = 'testName';
    let user: User;

    beforeEach(() => {
        user = new User(address, name);
    });

    describe('#constructor()', () => {
        it('should be defined', async () => {
            await expect(user).toBeDefined();
        });
    });
    describe('#getPoint()', () => {
        const point = 100;

        it('should return point', async () => {
            user = new User(address, name, point);
            await expect(user.getPoint()).toBe(point);
        });
    });
    describe('#increasePoint()',  () => {
        const validAmount = 10;

        it('should point to be increased',  async () => {
            await expect(user.increasePoint(validAmount)).toBeDefined();
            await expect(user.getPoint()).toBe(validAmount);
        });
    });
    describe('#canDecreasePoint()', () => {
        const point = 100;
        const validAmount = 10;
        const invalidAmount = 1000;

        beforeEach(() => {
            user = new User(address, name, point);
        });

        it('should return empty array', async () => {
            await expect(user.canDecreasePoint(validAmount).length).toEqual(0);
        });
        it('should return "not empty" array', async () => {
            await expect(user.canDecreasePoint(invalidAmount).length).toBeGreaterThan(0);
        });
    });
    describe('#decreasePoint()', () => {
        const point = 100;
        const validAmount = 10;
        const invalidAmount = 1000;

        beforeEach(() => {
            user = new User(address, name, point);
        });

        it('should return user with decreased point', async () => {
            await expect(await user.decreasePoint(validAmount)).toBeDefined();
            await expect(user.getPoint()).toBe(point - validAmount);
        });
        it('should throw Error "can not decrease point with the amount"', async () => {
            await expect(user.decreasePoint(invalidAmount))
                .rejects
                .toThrowError('can not decrease point with the amount');
        });
    });
    describe( '#getLevel()', () => {
        const level = 10;

        it('should return level',  async () => {
            user = new User(address, name, undefined, level);
            await expect(user.getLevel()).toBe(level);
        });
    });
    describe('#canIncreaseLevel()', () => {
        const validAmount = 10;
        const invalidAmount = 1000;

        it('should return empty array', async () => {
            await expect(user.canIncreaseLevel(validAmount).length).toEqual(0);
        });
        it('should return "not empty" array', async () => {
            await expect(user.canIncreaseLevel(invalidAmount).length).toBeGreaterThan(0);
        });
    });
    describe('#increaseLevel()',  () => {
        const validAmount = 10;
        const invalidAmount = 1000;

        it('should return user with increased level', async () => {
            await expect(await user.increaseLevel(validAmount)).toBeDefined();
            await expect(user.getLevel()).toBe(validAmount);
        });
        it('should throw error "can not increase level with the amount', async () => {
            await expect(user.increaseLevel(invalidAmount))
                .rejects
                .toThrowError('can not increase level with the amount');
        });
    });
});
