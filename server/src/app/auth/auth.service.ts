import { Inject, Injectable } from '@nestjs/common';
import { UserPayload } from './interfaces/user-payload.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @Inject('JwtService') private readonly jwtService: JwtService,
    ) {}

    createToken(address: string): object {
        const user: UserPayload = { address };
        const accessToken = this.jwtService.sign(user);
        const seconds = 3600;

        return {
                expiresIn: seconds,
                accessToken,
            };
    }
}
