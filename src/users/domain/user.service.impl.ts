import {UserService} from './user.service';
import {Injectable} from '@nestjs/common';
import {User} from './user.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {UserRepository} from './user.repository';

@Injectable()
export class UserServiceImpl implements UserService {

    constructor(@InjectRepository(User) private usersRepository: UserRepository) {}

    async isAbleToCreate(address: string): Promise<boolean> {
        if (address == undefined) {
            return false;
        }

        let user = await this.usersRepository.findByAddress(address);
        return user == undefined;
    }

    async isAbleToDelete(id: number): Promise<boolean> {
        if (id == null) {
            return false;
        }

        const user = await this.usersRepository.findById(id);
        return user != undefined;
    }

    async isAbleToGet(id: number): Promise<boolean> {
        return id != null;
    }

    async isAbleToUpdate(address: string): Promise<boolean> {
        if (address == undefined) {
            return false;
        }

        let user = await this.usersRepository.findByAddress(address);
        return user != undefined;
    }

}
