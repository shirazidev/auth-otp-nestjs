import { AuthModule } from "./../auth/auth.module";
import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserEntity } from "./entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OtpEntity } from "./entities/otp.entity";


@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([UserEntity, OtpEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
