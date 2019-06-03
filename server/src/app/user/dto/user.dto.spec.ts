import { UserDto } from './user.dto';

describe('User.Dto', () => {
    it('should be defined', () => {
        expect(new UserDto()).toBeDefined();
    });
});
