import { User} from './user.entity';
import {ValidationException} from '../exception/ValidationException';

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
        it('should throw Error ValidationException', async () => {
            await expect(user.decreasePoint(invalidAmount))
                .rejects
                .toThrowError(ValidationException);
        });
    });
    describe( '#getLevel()', () => {
        const level = 10;

        it('should return level',  async () => {
            user = new User(address, name, undefined, level);
            await expect(user.getLevel()).toBe(level);
        });
    });
    describe('#increaseLevel()',  () => {
        const validAmount = 10;
        const invalidAmount = 1000;

        it('should return user with increased level', async () => {
            await expect(await user.increaseLevel(validAmount)).toBeDefined();
            await expect(user.getLevel()).toBe(validAmount);
        });
        it('should throw error ValidationException', async () => {
            await expect(user.increaseLevel(invalidAmount))
                .rejects
                .toThrowError(ValidationException);
        });
    });
});
