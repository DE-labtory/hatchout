import { Module } from '@nestjs/common';
import { AuthService } from '../../app/auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule} from '@nestjs/jwt';
import { UserServiceImpl } from '../../app/user/user.service.impl';
import { UserModule } from './user.module';

@Module({
    imports: [PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secretOrPrivateKey: 'secretKey',
            signOptions: {
                expiresIn: 3600,
            },
        }),
        UserModule],
    providers: [AuthService,
        {provide: 'UserService', useClass: UserServiceImpl },
    ],

    exports: [PassportModule, AuthService],
})
export class AuthModule {}
