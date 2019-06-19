import {Test, TestingModule} from '@nestjs/testing';
import {ConfigModule, ConfigService} from 'nestjs-config';
import * as path from 'path';
import {RepositoryConfigService} from './repository.config.service';

describe('RepositoryConfig', () => {
    let configService: RepositoryConfigService;
    let config: ConfigService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.load(path.resolve(__dirname + '/test', 'config', '**/!(*.d).{ts,js}')),
            ],
            providers: [
                RepositoryConfigService,
            ],
        }).compile();

        configService = module.get<RepositoryConfigService>(RepositoryConfigService);
        config = module.get<ConfigService>(ConfigService);
    });

    describe('#createTypeOrmOptions()', () => {
        it('should return option', () => {

            const options = configService.createTypeOrmOptions();

            expect(options).toEqual(config.get(process.env.NODE_ENV));
        });

    });
});
