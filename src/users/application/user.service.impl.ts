import {Inject, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import {UserDto} from '../domain/dto/user.dto';
import {UsersRepository} from '../infra/users.repository';
import {UsersService} from './users.service';
import {DeleteResult} from 'typeorm';
import {UserService} from '../domain/user.service';
import * as domain from '../domain/user.service.impl';


@Injectable()
export class UserServiceImpl implements UsersService{


    //todo: di interface, not di struct
    constructor(@Inject(domain.UserServiceImpl) private userSerivce: UserService, @InjectRepository(User) private userRepository: UsersRepository) {}

    async get(id: number): Promise<User> {
        if (!await this.userSerivce.isAbleToGet(id)) {
            throw new Error('unable to get');
        }

        return await this.userRepository.findById(id);
    }

    async create(userDto: UserDto): Promise<User> {

        if (!await this.userSerivce.isAbleToCreate(userDto.address)) {
            throw new Error('unable to create');
        }

        const user = new User(userDto.address);
        return await this.userRepository.save(user);

    }

    async update(userDto: UserDto): Promise<User> {

        if (!await this.userSerivce.isAbleToUpdate(userDto.address)) {
            throw new Error('unable to update');
        }

        let user = await this.userRepository.findByAddress(userDto.address);

        //todo: business logic but for now i think user can't modify the field "address"

        return this.userRepository.save(user);
    }


    async delete(id: number):Promise<DeleteResult> {

        if (!await this.userSerivce.isAbleToDelete(id)) {
            throw new Error('unable to delete')
        }

        return await this.userRepository.delete(id);
    }

}
