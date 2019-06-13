import {Injectable, NotAcceptableException, NotFoundException} from '@nestjs/common';
import {UserService} from './user.service';
import {User} from '../../domain/user/user.entity';
import {DeleteResult} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {InvalidParameterException} from '../../domain/exception/InvalidParameterException';
import {IUserRepository} from '../../domain/user/user.repository';

@Injectable()
export class UserServiceImpl implements UserService {
    constructor(@InjectRepository(User) private userRepository: IUserRepository) {}

    async getByAddress(address: string): Promise<User> {
        return await this.userRepository.findByAddress(address);
    }

    async get(id: number): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (user === undefined) {
            throw new NotFoundException('user with the id is not found');
        }
        return user;
    }

    async create(address: string, name: string): Promise<User> {
        if (address === undefined) {
            throw new InvalidParameterException('address should be defined');
        }
        if (name === undefined) {
            throw new InvalidParameterException('name should be defined');
        }
        const userRetrieved = await this.userRepository.findByAddress(address);
        if (userRetrieved !== undefined) {
            throw new NotAcceptableException('address is already registered');
        }

        const user = new User(address, name);
        return await this.userRepository.save(user);
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.userRepository.delete(id);
    }

    async increasePoint(id: number, amount: number): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (user === undefined) {
            throw new NotFoundException('user with the id is not found');
        }

        return user.increasePoint(amount);
    }
    async decreasePoint(id: number, amount: number): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (user === undefined) {
            throw new NotFoundException('user with the id is not found');
        }

        return await user.decreasePoint(amount);
    }
    async increaseLevel(id: number, amount: number): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (user === undefined) {
            throw new NotFoundException('user with the id is not found');
        }

        return await user.increaseLevel(amount);
    }
}
