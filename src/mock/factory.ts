import {User} from '../users/domain/user.entity';

export function newMockRepository(findById: User, findByAddress: User, save: User) {
    const MockRepository = jest.fn().mockImplementation(() => {
        return {

            findById: jest.fn().mockImplementation(() => findById),
            findByAddress: jest.fn().mockImplementation(() => findByAddress),
            save: jest.fn().mockImplementation(() => save),
            delete: jest.fn().mockImplementation(() => undefined)
        };
    });

    return new MockRepository();
}
