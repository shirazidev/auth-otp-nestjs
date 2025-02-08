import { Module } from "@nestjs/common";
import { ConfigsCustomModule } from "./modules/config/configs.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmDbConfig } from "./config/typeorm.config";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    ConfigsCustomModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmDbConfig,
      inject: [TypeOrmDbConfig],
    }),
    UserModule,
    AuthModule,
    JwtModule,
  ],
  controllers: [],
  providers: [TypeOrmDbConfig],
})
export class AppModule {}
