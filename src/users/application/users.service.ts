import {User} from '../domain/user.entity';
import {UserDto} from '../domain/dto/user.dto';

export interface UsersService {
    get(id: number): Promise<User>;
    create(userDto: UserDto): Promise<User>;
    update(userDto: UserDto): Promise<User>;
    delete(id: number);
}
