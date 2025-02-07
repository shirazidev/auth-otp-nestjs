import { SendOtpDto, CheckOtpDto } from "./dto/auth.dto";
import { Inject, Injectable } from "@nestjs/common";
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
  async checkOtp(CheckOtpDto) {}

  async createOtpForUser(user: UserEntity) {
    const code: string = randomInt(10000, 99999).toString();
    const expires_in = new Date(new Date().getTime() + 1000 * 60 * 2);
    let otp = await this.otpRepository.findOneBy({ userId: user.id });
    if (otp) {
      otp.code = code;
      otp.expires_in = expires_in;
    } else {
      otp = this.otpRepository.create({
        userId: user.id,
        code,
        expires_in,
      });
      await this.otpRepository.save(otp);
      user.otpId = otp.id;
      await this.userRepository.save(user);
    }
  }
}
