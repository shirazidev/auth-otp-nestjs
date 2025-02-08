import { SendOtpDto, CheckOtpDto } from "./dto/auth.dto";
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../user/entities/user.entity";
import { Repository } from "typeorm";
import { OtpEntity } from "../user/entities/otp.entity";
import { randomInt } from "crypto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>
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
      await this.userRepository.update({id: user.id}, {mobile_verified: true})
    }
    return {
      message: "signed in successfully",
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
}
