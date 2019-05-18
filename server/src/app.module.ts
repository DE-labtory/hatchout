import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from 'nestjs-config';
import { GhostService } from './app/ghost/ghost.service';
import { GhostModule } from './port/module/ghost.module';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
    GhostModule,
  ],
  controllers: [AppController],
  providers: [AppService, GhostService],
})
export class AppModule {}
