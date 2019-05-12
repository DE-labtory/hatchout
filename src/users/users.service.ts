import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import {UserDto} from './user.dto';
import {UsersRepository} from './users.repository';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private usersRepository: UsersRepository) {}

    async getUser(id: number): Promise<User> {
        if (id == null) {
            throw new Error('id is null');
        }

        return await this.usersRepository.findById(id);
    }

    async updateUser(userDto: UserDto): Promise<User> {
        // todo: isAbleToUpdate로 추상화
        if (userDto.address == null) {
            throw new Error('address is null');
        }

        let user = await this.usersRepository.findByAddress(userDto.address);
        if (user == null) {
            throw new Error('user with the address doesnt exist');
        }

        return this.usersRepository.save(user);
    }

    async createUser(userDto: UserDto): Promise<User> {
        // todo: isAbleToCreate로 추상화.
        if (userDto.address == null) {
            throw new Error('address is null');
        }
        // todo: userRepository에서 findByAddress를 구현 후, 여기에서 findByAddress를 하여 이미 address가 있는 지 확인.

        const user = new User();
        user.address = userDto.address;
        return await this.usersRepository.save(user);

    }
    async deleteUser(id: number) {

        const user = await this.usersRepository.findById(id);
        if (user.id == null) {
            throw new Error('no user with the id');
        }

        return await this.usersRepository.delete(id);

    }
}
