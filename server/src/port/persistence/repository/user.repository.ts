import {DeleteResult} from 'typeorm';
import {User} from '../../../domain/user/user.entity';
import {Ghost} from '../../../domain/ghost/ghost.entity';

export interface IUserRepository {
    save(entity: User): Promise<User>;
    findById(id: number): Promise<User>;
    findByAddress(address: string): Promise<User>;
    delete(criteria: number): Promise<DeleteResult>;
}
