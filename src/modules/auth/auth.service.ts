import { CheckOtpDto, SendOtpDto } from "./dto/otp.dto";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { Repository } from "typeorm";
import { OtpEntity } from "../user/entities/otp.entity";
import { randomInt } from "crypto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { TokensPayload } from "./types/payload";
import { LoginDto, SignupDto } from "./dto/basic.dto";
import { compareSync, genSaltSync, hashSync } from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}
  async sendOtp(otpDto: SendOtpDto) {
    const { mobile } = otpDto;
    let user = await this.userRepository.findOneBy({ mobile });
    if (!user) {
      user = this.userRepository.create({ mobile });
      user = await this.userRepository.save(user);
    }
    await this.createOtpForUser(user);
    return {
      message: "sent code successfully!",
    };
  }
  async checkOtp(otpDto: CheckOtpDto) {
    const { mobile, code } = otpDto;
    const user = await this.userRepository.findOne({
      where: { mobile },
      relations: {
        otp: true,
      },
      select: {
        otp: {
          code: true,
          expires_in: true,
          userId: true,
        },
      },
    });
    const now = new Date();
    const otp = user?.otp;
    if (!user || !otp)
      throw new UnauthorizedException("we cannot authorize you");
    if (code !== otp?.code)
      throw new UnauthorizedException("your code is invalid");
    if (otp?.expires_in < now)
      throw new UnauthorizedException("your code is expired");
    if (!user.mobile_verified) {
      await this.userRepository.update(
        { id: user.id },
        { mobile_verified: true }
      );
    }
    const { accessToken, refreshToken } = await this.makeTokensOfUser({
      id: user.id,
      mobile: mobile,
    });

    return {
      accessToken,
      refreshToken,
      message: "signed in successfully",
    };
  }
  async signup(signupDto: SignupDto) {
    let { email, mobile, password, first_name, last_name } = signupDto;
    await this.checkMobile(mobile);
    await this.checkEmail(email);
    password = await this.passwordMatch(password);
    let user = this.userRepository.create({
      email,
      mobile,
      password,
      first_name,
      last_name,
      mobile_verified: false,
    });
    user = await this.userRepository.save(user);
    return {
      message: "user created successfully",
    };
  }
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOneBy({ email });
    if (!user)
      throw new UnauthorizedException(
        "User account with this credintials not found."
      );
    if (!user?.password)
      throw new UnauthorizedException("you cannot login using password!");
    if (!compareSync(password, user.password))
      throw new UnauthorizedException(
        "User account with this credintials not found."
      );
    const { accessToken, refreshToken } = await this.makeTokensOfUser({
      id: user?.id,
      email: user?.email,
      mobile: user?.mobile,
    });
    return {
      accessToken,
      refreshToken,
      message: "user logged in successfully!",
    };
  }
  async checkEmail(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (user) throw new ConflictException("email is already taken");
    return null;
  }
  async checkMobile(mobile: string) {
    const user = await this.userRepository.findOneBy({ mobile });
    if (user) throw new ConflictException("mobile phone is already taken");
  }
  async passwordMatch(password: string) {
    const salt = genSaltSync(10);
    return hashSync(password, salt);
  }

  async makeTokensOfUser(payload: TokensPayload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get("Jwt.accessTokenSecret"),
      expiresIn: "30d",
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get("Jwt.refreshTokenSecret"),
      expiresIn: "1y",
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async createOtpForUser(user: UserEntity) {
    const code: string = randomInt(10000, 99999).toString();
    const expires_in = new Date(new Date().getTime() + 1000 * 60 * 2);
    let otp = await this.otpRepository.findOneBy({ userId: user.id });

    if (otp) {
      if (otp.expires_in > new Date()) {
        throw new BadRequestException("try later, otp code not expired.");
      }
      otp.code = code;
      otp.expires_in = expires_in;
    } else {
      otp = this.otpRepository.create({
        userId: user.id,
        code,
        expires_in,
      });
      user.otpId = otp.id;
      await this.userRepository.save(user);
    }
    await this.otpRepository.save(otp);
  }
  async validateAccessToken(token: string) {
    try {
      const payload = this.jwtService.verify<TokensPayload>(token, {
        secret: this.configService.get<string>("Jwt.accessTokenSecret"),
      });
      if (typeof payload === "object" && payload?.id) {
        const user = await this.userRepository.findOneBy({ id: payload.id });
        if (!user) throw new UnauthorizedException("Login to your account");
        return user;
      }
      throw new UnauthorizedException("Login to your account");
    } catch (error) {
      throw new UnauthorizedException("Login to your account");
    }
  }
}
