import {Ghost} from './ghost.entity';
import {MAX_LEVEL} from './level';
import {ValidationException} from '../exception/ValidationException';
import {User} from '../user/user.entity';

describe('Ghost.Entity', () => {
  const gene = 'testGene';
  const tokenId = 0;
  const userAddress = 'testUserAddress';
  let ghost: Ghost;
  beforeEach(() => {
    ghost = new Ghost(gene, tokenId, userAddress);
  });

  describe('#increaseLevel()', () => {
    const validAmount = 10;
    let invalidAmount: number;
    it('should return ghost with increased level', () => {
      const level = ghost.getLevel();
      expect(ghost.increaseLevel(validAmount)).toBeDefined();
      expect(ghost.getLevel()).toBe(level + validAmount);
    });
    it('should throw Validation Exception when level becomes more than MAX_LEVEL', () => {
      invalidAmount = MAX_LEVEL + 1;
      expect(() => ghost.increaseLevel(invalidAmount)).toThrowError(ValidationException);
    });
    it('should throw Validation Exception when amount is negative', () => {
      invalidAmount = -1;
      expect(() => ghost.increaseLevel(invalidAmount)).toThrowError(ValidationException);
    });
  });
  describe('#changeUser()', () => {
    let user: User;
    it('should return ghost with changed userAddress', () => {
      user = new User('testAddress', 'testName');
      ghost = ghost.changeUser(user);
      expect(ghost.getUserAddress()).toBe(user.getAddress());
    });
    it('should throw Validation Exception when userAddress is undefined', () => {
      user = new User(undefined, 'testName');
      expect(() => ghost.changeUser(user)).toThrowError(ValidationException);
    });
  });
});
