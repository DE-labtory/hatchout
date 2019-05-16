import {Injectable} from '@nestjs/common';
import { User } from '../domain/user.entity';
import { Controller, Post, Body, Get, Put, Delete, Param} from '@nestjs/common';
import {UsersService} from '../application/users.service';

@Injectable()
@Controller('users')
export class UsersController {

    constructor(private service: UsersService) { }

    @Get(':id')
    get(@Param() params) {
        return this.service.get(params.id);
    }

    @Post()
    create(@Body() user: User) {
        return this.service.create(user);
    }

    @Put()
    update(@Body() user: User) {
        return this.service.update(user);
    }

    @Delete(':id')
    deleteUser(@Param() params) {
        return this.service.delete(params.id);
    }
}
