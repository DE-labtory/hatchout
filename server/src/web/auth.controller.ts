import {Body, Controller, Get, Post, Req, UseGuards} from '@nestjs/common';
import {AuthService} from '../app/auth/auth.service';
import {Token} from '../app/auth/token.entity';
import {AuthGuard} from '@nestjs/passport';
import {SignUpResponseDto} from '../app/auth/dto/sign-up-response.dto';
import {SignInResponseDto} from '../app/auth/dto/sign-in-response.dto';
import {SignUpRequestDto} from '../app/auth/dto/sign-up-request.dto';
import {SignInRequestDto} from '../app/auth/dto/sign-in-request.dto';
import {CreateTokenRequestDto} from '../app/auth/dto/create-token-request.dto';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {
  }

  @Post('token')
  @UseGuards(AuthGuard())
  async createToken(@Body() data: CreateTokenRequestDto): Promise<Token> {
    return await this.authService.createToken(data.address);
  }

  @Post('signup')
  async signUp(@Body() data: SignUpRequestDto): Promise<SignUpResponseDto> {
    return await this.authService.signUp(
      data.address,
      data.name,
      data.message,
      data.signature,
    );
  }

  @Post('signin')
  async signIn(@Body() data: SignInRequestDto): Promise<SignInResponseDto> {
    return await this.authService.signIn(data.address, data.message, data.signature);
  }

}
