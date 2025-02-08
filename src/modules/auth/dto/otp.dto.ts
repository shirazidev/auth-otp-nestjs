import { IsMobilePhone, IsNotEmpty, IsString, Length } from "class-validator";

export class SendOtpDto {
  @IsMobilePhone(
    "fa-IR",
    {},
    { message: "You can only enter Iranian phone number." },
  )
  @IsNotEmpty()
  mobile: string;
}
export class CheckOtpDto {
  @IsMobilePhone(
    "fa-IR",
    {},
    { message: "You can only enter Iranian phone number." },
  )
  @IsNotEmpty()
  mobile: string;
  @IsString()
  @Length(5, 5, { message: "the code should have 5 chars." })
  @IsNotEmpty()
  code: string;
}
