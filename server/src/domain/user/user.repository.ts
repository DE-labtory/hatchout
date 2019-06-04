import {DeleteResult} from 'typeorm';
import {User} from './user.entity';

export interface IUserRepository {
    save(entity: User): Promise<User>;
    findById(id: number): Promise<User>;
    findByAddress(address: string): Promise<User>;
    delete(criteria: number): Promise<DeleteResult>;
}
