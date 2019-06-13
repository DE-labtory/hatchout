import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserServiceImpl } from '../user/user.service.impl';
import { ValidationServiceImpl } from '../../domain/user/validation.service.impl';
import { User } from '../../domain/user/user.entity';
import { Token } from './token.entity';
import { SignUpResponseDto } from './dto/sign-up-response.dto';
import { SignInResponseDto } from './dto/sign-in-response.dto';

@Injectable()
export class AuthService {
    constructor(
        @Inject('JwtService') private readonly jwtService: JwtService,
        @Inject('UserService') private readonly userService: UserServiceImpl,
        @Inject('ValidationService') private readonly validationService: ValidationServiceImpl,
    ) {}

    createToken(address: string): Token {
        if (address === undefined) {
            throw new Error('address should be defined.');
        }

        return {
            expiresIn: 3600,
            accessToken: this.jwtService.sign(address),
        };
    }

    async signUp(address: string, message: string, signature: string): Promise<SignUpResponseDto> {
        const result: boolean = this.validationService.verify(address, message, signature);
        if (!result) {
            throw new UnauthorizedException();
        }

        const user: User = await this.userService.create(address, 'name');
        const jwt: Token = await this.createToken(address);

        return new SignUpResponseDto(jwt.accessToken, user.address, user.name);
    }

    async signIn(address: string, message: string, signature: string): Promise<SignInResponseDto> {
        const result: boolean = this.validationService.verify(address, message, signature);
        if (!result) {
            throw new UnauthorizedException();
        }

        const user: User = await this.userService.getByAddress(address);
        if (user === undefined) {
            throw new Error('user not found');
        }

        const jwt: Token = await this.createToken(user.address);

        return new SignInResponseDto(jwt.accessToken, user.address, user.name);
    }
}
