import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthService } from '../app/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Get('token')
    @UseGuards(AuthGuard())
    async createToken(address: string): Promise<object> {
        return await this.authService.createToken(address);
    }

    @Get('signUp')
    @UseGuards(AuthGuard())
    async signUp(data: {address: string, message: string}, signature: string): Promise<any> {
        return await this.authService.signUp(data, signature);
    }

    @Get('signIn')
    async logIn(data: {address: string, message: string}, signature: string): Promise<any> {
        return await this.authService.signIn(data, signature);
    }

}
