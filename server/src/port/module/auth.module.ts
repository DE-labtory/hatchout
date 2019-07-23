import { Module } from '@nestjs/common';
import { AuthService } from '../../app/auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './user.module';
import { JwtModule} from '@nestjs/jwt';
import { ValidationServiceImpl } from '../../domain/user/validation.service.impl';
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
                expiresIn: '10h',
            },
        }),
        UserModule],
    providers: [
        AuthService,
        JwtStrategy,
        {provide: 'ValidationService', useClass: ValidationServiceImpl},
        {provide: 'BridgeService', useClass: Web3BridgeService},
        {provide: 'WEB3', useClass: Web3},
    ],
    controllers: [AuthController],
    exports: [PassportModule],
})
export class AuthModule {
}
