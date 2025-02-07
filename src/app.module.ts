import { Module } from "@nestjs/common";
import { ConfigsCustomModule } from "./modules/config/configs.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmDbConfig } from "./config/typeorm.config";
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [ConfigsCustomModule, TypeOrmModule.forRootAsync({
    useClass: TypeOrmDbConfig,
    inject: [TypeOrmDbConfig]
  }), UserModule],
  controllers: [],
  providers: [TypeOrmDbConfig],
})
export class AppModule {}
