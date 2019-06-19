import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Injectable,
    Param, ParseIntPipe,
    Post, Put,
    Query,
} from '@nestjs/common';
import {User} from '../../domain/user/user.entity';
import {UserDto} from '../../app/user/dto/user.dto';
import {DeleteResult} from 'typeorm';
import {UserService} from '../../app/user/user.service';

@Injectable()
@Controller('users')
export class UserController {
    constructor(@Inject('UserService') private service: UserService) {}

    @Get(':id')
    async get(@Param('id') id: number): Promise<User> {
        return await this.service.get(id);
    }
    @Post()
    async create(@Body() userDto: UserDto): Promise<User> {
        return await this.service.create(userDto);
    }
    @Delete(':id')
    async delete(@Param('id') id: number): Promise<DeleteResult> {
        return await this.service.delete(id);
    }
    @Put(':id/increase-level')
    async increaseLevel(@Param('id') id: number, @Query('amount', new ParseIntPipe()) amount): Promise<User> {
        return await this.service.increaseLevel(id, amount);
    }
    @Put(':id/increase-point')
    async increasePoint(@Param('id') id: number, @Query('amount', new ParseIntPipe()) amount): Promise<User> {
        return await this.service.increasePoint(id, amount);
    }
    @Put(':id/decrease-point')
    async decreasePoint(@Param('id') id: number, @Query('amount', new ParseIntPipe()) amount): Promise<User> {
        return await this.service.decreasePoint(id, amount);
    }
}
