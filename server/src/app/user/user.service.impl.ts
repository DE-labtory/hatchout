import {BadRequestException, Inject, Injectable} from '@nestjs/common';
import {UserService} from './user.service';
import {UserDto} from '../../domain/user/dto/user.dto';
import {User} from '../../domain/user/user.entity';
import {DeleteResult} from 'typeorm';
import {IUserRepository} from '../../port/persistence/repository/user.repository';

@Injectable()
export class UserServiceImpl implements UserService {

    constructor(@Inject('IUserRepository') private userRepository: IUserRepository) {}

    async get(id: number): Promise<User> {
        let user = await this.userRepository.findById(id);
        if (user == undefined) {
            throw new BadRequestException('no user with the id')
        }
        return await this.userRepository.findById(id);
    }
    async create(userDto: UserDto): Promise<User> {
        if (userDto.address === undefined) {
            throw new Error('address should be defined');
        }
        if (userDto.name === undefined) {
            throw new Error('name should be defined');
        }
        const userRetrieved = await this.userRepository.findByAddress(userDto.address);
        if (userRetrieved !== undefined) {
            throw new Error('address is already registered');
        }

        const user = new User(userDto.address, userDto.name);
        return await this.userRepository.save(user);
    }
    async delete(id: number): Promise<DeleteResult> {
        return await this.userRepository.delete(id);
    }
    async increasePoint(id: number, amount: number): Promise<User> {
        let user: User;
        user = await this.userRepository.findById(id);
        if (user === undefined) {
            throw new Error('user with the id is not found');
        }

        return user.increasePoint(amount);
    }
    async decreasePoint(id: number, amount: number): Promise<User> {
        let user: User;
        user = await this.userRepository.findById(id);
        if (user === undefined) {
            throw new Error('user with the id is not found');
        }

        let errors: Error[];
        errors = user.canDecreasePoint(amount);
        if (errors.length !== 0) {
            throw new Error('can not decrease point');
        }

        return await user.decreasePoint(amount);
    }
    async increaseLevel(id: number, amount: number): Promise<User> {
        let user: User;
        user = await this.userRepository.findById(id);
        if (user === undefined) {
            throw new Error('user with the id is not found');
        }

        let errors: Error[];
        errors = user.canIncreaseLevel(amount);
        if ( errors.length !== 0) {
            throw new Error('can not increase level');
        }

        return await user.increaseLevel(amount);
    }
}
