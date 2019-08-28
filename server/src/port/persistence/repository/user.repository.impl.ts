import {EntityRepository, Repository} from 'typeorm';
import {User} from '../../../domain/user/user.entity';
import {IUserRepository} from '../../../domain/user/user.repository';

@EntityRepository(User)
export class UserRepository extends Repository<User> implements IUserRepository {
    async findById(id: number): Promise<User> {
        return await this.findOne(id);
    }

    async findByAddress(address: string): Promise<User> {
        return await this.findOne({address});
    }
}
