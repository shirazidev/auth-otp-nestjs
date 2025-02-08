import { Body, Controller, Get, ParseIntPipe, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CheckOtpDto, SendOtpDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/send-otp')
  async sendOtp(@Body() otpDto: SendOtpDto) {
    return await this.authService.sendOtp(otpDto)
  }
  @Post('/check-otp')
  async checkOtp(@Body() otpDto: CheckOtpDto) {
    return await this.authService.checkOtp(otpDto)
  }
}
