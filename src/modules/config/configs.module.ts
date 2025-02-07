import { ConfigModule } from "@nestjs/config";
import { Module } from "@nestjs/common";
import { configurations } from "src/config/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configurations,
      isGlobal: true,
    }),
  ],
})
export class ConfigsCustomModule {}
