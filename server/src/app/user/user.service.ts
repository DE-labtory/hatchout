import {User} from '../../domain/user/user.entity';
import {DeleteResult} from 'typeorm';

export interface UserService {
    get(id: number): Promise<User>;
    getByAddress(address: string): Promise<User>;
    create(address: string, name: string): Promise<User>;
    delete(id: number): Promise<DeleteResult>;
    increaseLevel(id: number, amount: number): Promise<User>;
    increasePoint(id: number, amount: number): Promise<User>;
    decreasePoint(id: number, amount: number): Promise<User>;
}
