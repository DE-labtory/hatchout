import {EntityRepository, FindConditions, FindOneOptions, Repository} from 'typeorm';
import {User} from './user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
    findById(id: number) {
        return this.findOne({ id });
    }

    findByAddress(address: string) {
        return this.findOne({address});
    }
}
