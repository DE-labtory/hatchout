import { Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import {UserDto} from './user.dto';
import {UsersRepository} from './users.repository';
import {UsersService} from './users.service';
import {DeleteResult} from 'typeorm';



@Injectable()
export class UsersServiceImpl implements UsersService{


    constructor(@InjectRepository(User) private usersRepository: UsersRepository) {}

    async get(id: number): Promise<User> {
        if (!await this.isAbleToGet(id)) {
            throw new Error('unable to get');
        }

        return await this.usersRepository.findById(id);
    }

    private async isAbleToGet(id:number):Promise<boolean>{
        return id != null;
    }

    async create(userDto: UserDto): Promise<User> {

        if (!await this.isAbleToCreate(userDto.address)) {
            throw new Error('unable to create');
        }

        const user = new User(userDto.address);
        return await this.usersRepository.save(user);

    }

    private async isAbleToCreate(address: string): Promise<boolean>{
        if (address == undefined) {
            return false;
        }

        let user = await this.usersRepository.findByAddress(address);
        return user == undefined;
    }

    async update(userDto: UserDto): Promise<User> {

        if (!await this.isAbleToUpdate(userDto.address)) {
            throw new Error('unable to update');
        }

        let user = await this.usersRepository.findByAddress(userDto.address);

        //todo: business logic but for now i think user can't modify the field "address"

        return this.usersRepository.save(user);
    }

    private async isAbleToUpdate(address: string): Promise<boolean> {
        if (address == undefined) {
            return false;
        }

        let user = await this.usersRepository.findByAddress(address);
        return user != undefined;
    }


    async delete(id: number):Promise<DeleteResult> {

        if (!await this.isAbleToDelete(id)) {
            throw new Error('unable to delete')
        }

        console.log('llll');
        let deleteResult = await this.usersRepository.delete(id);
        console.log(deleteResult);

        return await this.usersRepository.delete(id);
    }

    private async isAbleToDelete(id: number) :Promise<boolean>{
        if (id == null) {
            return false;
        }

        const user = await this.usersRepository.findById(id);
        return user != undefined;
    }
}
