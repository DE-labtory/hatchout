import { Module } from '@nestjs/common';
import { AuthService } from '../../app/auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './user.module';
import { JwtModule, JwtSecretRequestType, JwtService } from '@nestjs/jwt';
import { UserServiceImpl } from '../../app/user/user.service.impl';
import { ValidationServiceImpl } from '../../domain/user/validation.service.impl';
import { UserRepository } from '../persistence/repository/user.repository.impl';
import { Web3BridgeService } from '../adapter/service/blockchain/ethereum/web3/web3.bridge.service';
import Web3 from 'web3';
import { AuthController } from '../../web/auth.controller';
import { JwtStrategy } from '../../app/auth/jwt.strategy';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
                secretOrKeyProvider: () => {
                    return 'secretKey';
                },
            signOptions: {
                expiresIn: 3600,
            },
        }),
        UserModule],
    providers: [AuthService, UserRepository, JwtStrategy,
        {provide: 'UserService', useClass: UserServiceImpl},
        {provide: 'ValidationService', useClass: ValidationServiceImpl},
        {provide: 'BridgeService', useClass: Web3BridgeService},
        {provide: 'WEB3', useClass: Web3},
    ],
    controllers: [AuthController],
    exports: [PassportModule],
})
export class AuthModule {
}
