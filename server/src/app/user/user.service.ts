import {User} from '../../domain/user/user.entity';
import {DeleteResult} from 'typeorm';
import {UserDto} from './dto/user.dto';

export interface UserService {
    get(id: number): Promise<User>;
    create(userDto: UserDto): Promise<User>;
    delete(id: number): Promise<DeleteResult>;
    increaseLevel(id: number, amount: number): Promise<User>;
    increasePoint(id: number, amount: number): Promise<User>;
    decreasePoint(id: number, amount: number): Promise<User>;
}
