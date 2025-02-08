import { registerAs } from "@nestjs/config";
// import {config} from "dotenv"
// config()
export enum ConfigKeys {
  App = "App",
  Db = "Db",
  Jwt = "Jwt",
}
const AppConfig = registerAs(ConfigKeys.App, () => ({
  port: process.env.PORT || 3000,
}));
const DbConfig = registerAs(ConfigKeys.Db, () => ({
  port: process.env.DBPORT || 5432,
  host: process.env.DBHOST || "localhost",
  username: process.env.DBUSERNAME || "postgres",
  password: process.env.DBPASSWORD || "123456",
  database: process.env.DB || "auth-otp",
}));
const JwtConfig = registerAs(ConfigKeys.Jwt, () => ({
  accessTokenSecret: process.env.ACCESSTOKENJWT || "hard?@to@#guess",
  refreshTokenSecret: process.env.REFRESHTOKENJWT || "hard?@to@#guess",
}));

export const configurations = [AppConfig, DbConfig, JwtConfig];
