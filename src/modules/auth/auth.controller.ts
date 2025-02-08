import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CheckOtpDto, SendOtpDto } from "./dto/otp.dto";
import { LoginDto, SignupDto } from "./dto/basic.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("/send-otp")
  async sendOtp(@Body() otpDto: SendOtpDto) {
    return await this.authService.sendOtp(otpDto);
  }
  @Post("/check-otp")
  async checkOtp(@Body() otpDto: CheckOtpDto) {
    return await this.authService.checkOtp(otpDto);
  }
  @Post("/signup")
  async signup(@Body() signupDto: SignupDto) {
    return await this.authService.signup(signupDto);
  }
  @Post("/login")
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
