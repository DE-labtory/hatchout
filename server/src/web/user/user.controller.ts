import {BadRequestException, Body, Controller, Delete, Get, Inject, Injectable, Param, Post, Req} from '@nestjs/common';
import {User} from '../../domain/user/user.entity';
import {UserDto} from '../../domain/user/dto/user.dto';
import {DeleteResult} from 'typeorm';
import {UserService} from '../../app/user/user.service';

@Injectable()
@Controller('users')
export class UserController {
    constructor(@Inject('UserService') private service: UserService) {}

    @Get(':id')
    async get(@Param('id') id: number): Promise<User> {
        let user = await this.service.get(id);
        if (user == undefined) {
            throw new BadRequestException('no user with the id');
        }
        return user;
    }

    @Post()
    async create(@Body() userDto: UserDto): Promise<User> {
        return await this.service.create(userDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: number): Promise<DeleteResult> {
        return await this.service.delete(id);
    }

    @Post(':id')
    async increaseLevel(@Param('id') id: number, @Param('amount') amount: number): Promise<User> {
        return await this.service.increaseLevel(id, amount);
    }

    @Post(':id')
    async decreasePoint(@Param('id') id: number, @Param('amount') amount: number): Promise<User> {
        return await this.service.decreasePoint(id, amount);
    }
    @Post(':id')
    async increasePoint(@Param('id') id: number, @Param('amount') amount: number): Promise<User> {
        return await this.service.increasePoint(id, amount);
    }
}
