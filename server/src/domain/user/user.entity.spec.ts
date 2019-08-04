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
        it('should be defined', () => {
            expect(user).toBeDefined();
        });
    });
    describe('#getPoint()', () => {
        const point = 100;

        it('should return point', () => {
            user = new User(address, name, point);
            expect(user.getPoint()).toBe(point);
        });
    });
    describe('#increasePoint()',  () => {
        const validAmount = 10;
        it('should return user with increased point',  () => {
            expect(user.increasePoint(validAmount)).toBeDefined();
            expect(user.getPoint()).toBe(validAmount);
        });
        it('should throw ValidationException when amount is negative',  () => {
            const invalidAmount = -1;
            expect(() => user.increasePoint(invalidAmount)).toThrowError(ValidationException);
        });
    });
    describe('#decreasePoint()', () => {
        const point = 100;
        const validAmount = 10;
        let invalidAmount: number;

        beforeEach(() => {
            user = new User(address, name, point);
        });

        it('should return user with decreased point',  () => {
          expect(user.decreasePoint(validAmount)).toBeDefined();
          expect(user.getPoint()).toBe(point - validAmount);
        });
        it('should throw ValidationException when amount is negative', () => {
            invalidAmount = -1;
            expect(() => user.decreasePoint(invalidAmount)).toThrowError(ValidationException);
        });
        it('should throw ValidationException when point becomes less than MIN_POINT',  () => {
            invalidAmount = 1000;
            expect(() => user.decreasePoint(invalidAmount)).toThrowError(ValidationException);
        });
    });
    describe( '#getLevel()', () => {
        const level = 10;

        it('should return level',  () => {
            user = new User(address, name, undefined, level);
            expect(user.getLevel()).toBe(level);
        });
    });
    describe('#increaseLevel()',  () => {
        const validAmount = 10;
        let invalidAmount: number;

        it('should return user with increased level',  () => {
          expect(user.increaseLevel(validAmount)).toBeDefined();
          expect(user.getLevel()).toBe(validAmount);
        });
        it('should throw ValidationException when amount is negative', () => {
            invalidAmount = -1;
            expect(() => user.increaseLevel(invalidAmount)).toThrowError(ValidationException);
        });
        it('should throw ValidationException when level becomes more than MAX_LEVEL',  () => {
            invalidAmount = 1000;
            expect(() => user.increaseLevel(invalidAmount)).toThrowError(ValidationException);
        });
    });
});
