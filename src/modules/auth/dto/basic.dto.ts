import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsString,
  Length,
} from "class-validator";
import { ConfirmedPassword } from "src/common/decorators/password.decorator";

export class SignupDto {
  @IsString()
  first_name: string;
  @IsString()
  last_name: string;
  @IsString()
  @IsEmail(
    {
      host_whitelist: [
        "gmail.com",
        "yahoo.com",
        "hotmail.com",
        "outlook.com",
        "outlook.de",
      ],
    },
    { message: "Email is not valid" },
  )
  email: string;
  @IsMobilePhone(
    "fa-IR",
    {},
    { message: "You can only enter Iranian phone number." },
  )
  @IsNotEmpty()
  mobile: string;
  @IsString()
  @Length(8, 20, { message: "Password should be between 8 and 20 characters" })
  password: string;
  @ConfirmedPassword("password")
  confirm_password: string;
}
export class LoginDto {
  @IsEmail(
    {
      host_whitelist: [
        "gmail.com",
        "yahoo.com",
        "hotmail.com",
        "outlook.com",
        "outlook.de",
      ],
    },
    { message: "Email is not valid" },
  )
  email: string;
  @IsString()
  password: string;
}
