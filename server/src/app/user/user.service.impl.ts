import {Injectable, NotAcceptableException, NotFoundException} from '@nestjs/common';
import {UserService} from './user.service';
import {User} from '../../domain/user/user.entity';
import {DeleteResult} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {UserDto} from './dto/user.dto';
import {InvalidParameterException} from '../../domain/exception/InvalidParameterException';
import {IUserRepository} from '../../domain/user/user.repository';

@Injectable()
export class UserServiceImpl implements UserService {
    constructor(@InjectRepository(User) private userRepository: IUserRepository) {}

    async get(id: number): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (user === undefined) {
            throw new NotFoundException('user with the id is not found');
        }
        return user;
    }

    async create(userDto: UserDto): Promise<User> {
        if (userDto.address === undefined) {
            throw new InvalidParameterException('address should be defined');
        }
        if (userDto.name === undefined) {
            throw new InvalidParameterException('name should be defined');
        }
        const userRetrieved = await this.userRepository.findByAddress(userDto.address);
        if (userRetrieved !== undefined) {
            throw new NotAcceptableException('address is already registered');
        }

        const user = new User(userDto.address, userDto.name);
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
