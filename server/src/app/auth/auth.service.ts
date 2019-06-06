import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserServiceImpl } from '../user/user.service.impl';
import { ValidationServiceImpl } from '../../domain/user/validation.service.impl';
import { User } from '../../domain/user/user.entity';
import { AuthDto } from './dto/auth.dto';
import { Token } from './token.entity';

@Injectable()
export class AuthService {
    constructor(
        @Inject('JwtService') private readonly jwtService: JwtService,
        @Inject('UserService') private readonly userService: UserServiceImpl,
        @Inject('ValidationService') private readonly validationService: ValidationServiceImpl,
    ) {}

    async createToken(address: string): Promise<Token> {
        if (address === null) {
            throw new Error('address should be defined.');
        }

        return {
            expiresIn: 3600,
            accessToken: this.jwtService.sign(address),
        };
    }

    async signUp(data: {address: string, message: string}, signature: string): Promise<AuthDto> {
        const {address, message } = data;
        // signature
        await this.validateUser(address, message, signature);
        // 새 user 객체 생성
        const user: User = await this.userService.create(address, 'name');
        const jwt: Token = await this.createToken(user.address);
        return new AuthDto(jwt.accessToken, user.address, user.name);
    }

    async validateUser(address: string, message: string, signature: string) {
        const result: boolean = this.validationService.verify(address, message, signature);
        if (!result) {
            throw new UnauthorizedException();
        }
    }

    async signIn(data: {address: string, message: string}, signature: string): Promise<AuthDto> {
        const {address, message } = data;
        // signature
        await this.validateUser(address, message, signature);
        const user: User = await this.userService.getByAddress(address);
        if (user === undefined) {
            throw new Error('user not found');
        }

        const jwt: Token = await this.createToken(user.address);
        return new AuthDto(jwt.accessToken, user.address, user.name);
    }
}
