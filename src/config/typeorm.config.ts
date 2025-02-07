import { ConfigService } from '@nestjs/config';
import { Injectable } from "@nestjs/common";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

@Injectable()
export class TypeOrmDbConfig implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService){}
    createTypeOrmOptions(connectionName?: string): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
        return {
            type: "postgres",
            database: this.configService.get("Db.database"),
            port: this.configService.get("Db.port"),
            host: this.configService.get("Db.host"),
            username: this.configService.get("Db.username"),
            password: this.configService.get("Db.password"),
            synchronize: true,
            autoLoadEntities: false,
            entities: [
                "dist/**/**/**/*.entity{.ts,.js}",
                "dist/**/**/*.entity{.ts,.js}",
            ]
        }
    }
}