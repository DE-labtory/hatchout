import {InjectConfig} from 'nestjs-config';
import {Injectable} from '@nestjs/common';
import {TypeOrmModuleOptions, TypeOrmOptionsFactory} from '@nestjs/typeorm';

@Injectable()
export class RepositoryConfigService implements TypeOrmOptionsFactory {
    constructor(@InjectConfig() private config) {
        this.config = config.get(process.env.NODE_ENV);
    }

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: this.config.type,
            host: this.config.host,
            logging: this.config.logging,
            port: this.config.port,
            username: this.config.username,
            password: this.config.password,
            database: this.config.database,
            synchronize: this.config.synchronize,
            entities: this.config.entities,
        };
    }
}
