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
        if (user == undefined) {
            throw new Error('user with the address doesnt exists');
        }

        //todo: business logic but for now i think user can't modify the field "address"

        return this.usersRepository.save(user);
    }

    async createUser(userDto: UserDto): Promise<User> {
        // todo: isAbleToCreate로 추상화.
        if (userDto.address == undefined) {
            throw new Error('address is undefined');
        }

        let userForCheck = await this.usersRepository.findByAddress(userDto.address);
        if (userForCheck != undefined) {
            throw new Error('user with the address already exists')
        }

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
