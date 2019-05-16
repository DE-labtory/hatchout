import {EntityRepository, FindConditions, FindOneOptions, Repository} from 'typeorm';
import {User} from '../domain/user.entity';
import {UserRepository} from '../domain/user.repository';

@EntityRepository(User)
export class UsersRepository extends Repository<User> implements UserRepository{
    findById(id: number) {
        return this.findOne({ id });
    }

    findByAddress(address: string) {
        return this.findOne({address});
    }
}
