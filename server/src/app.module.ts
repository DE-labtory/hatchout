import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from 'nestjs-config';
import { GhostService } from './app/ghost/ghost.service';
import { GhostModule } from './port/module/ghost.module';
import * as path from 'path';
import {UserModule} from './port/module/user.module';
import { AuthModule } from './port/module/auth.module';

@Module({
  imports: [
    ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
    GhostModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, GhostService],
})
export class AppModule {}
