import { Inject, Injectable } from '@nestjs/common';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @Inject('JwtService') private readonly jwtService: JwtService,
    ) {}

    createToken(email: string) {
        const user: JwtPayload = { email };
        const accessToken = this.jwtService.sign(user);
        const seconds = 3600;
        return {
            expiresIn: seconds,
            accessToken,
        };
    }
}
