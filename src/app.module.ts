import { Module } from "@nestjs/common";
import { ConfigsCustomModule } from "./modules/config/configs.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmDbConfig } from "./config/typeorm.config";

@Module({
  imports: [ConfigsCustomModule, TypeOrmModule.forRootAsync({
    useClass: TypeOrmDbConfig,
    inject: [TypeOrmDbConfig]
  })],
  controllers: [],
  providers: [TypeOrmDbConfig],
})
export class AppModule {}
