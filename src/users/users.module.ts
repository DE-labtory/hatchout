import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import {User} from './user.entity';
import {TypeOrmModule} from '@nestjs/typeorm';

@Module({
    imports: [

        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'rootpassword',
            database: 'hatchout_server',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
        }),

        TypeOrmModule.forFeature([User]),
    ],
    providers: [
      UsersService,
    ],
})
export class UsersModule {}
