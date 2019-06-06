import { Module } from '@nestjs/common';
import { AuthService } from '../../app/auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './user.module';
import { AuthController } from '../../web/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { UserServiceImpl } from '../../app/user/user.service.impl';
import { ValidationServiceImpl } from '../../domain/user/validation.service.impl';
import { UserRepository } from '../persistence/repository/user.repository.impl';
import { Web3BridgeService } from '../adapter/service/blockchain/ethereum/web3/web3.bridge.service';
import Web3 from 'web3';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        ConfigModule,
        JwtModule.registerAsync({
            useFactory: (config: ConfigService) => config.get('auth'),
            inject: [ConfigService],
        }),
        UserModule],
    providers: [AuthService,
        {provide: 'UserService', useClass: UserServiceImpl},
        {provide: 'ValidationService', useClass: ValidationServiceImpl},
        {provide: 'IUserRepository', useClass: UserRepository},
        {provide: 'BridgeService', useClass: Web3BridgeService},
        {provide: 'WEB3', useClass: Web3},
    ],
    controllers: [AuthController],
    exports: [PassportModule, AuthService],
})
export class AuthModule {
}
