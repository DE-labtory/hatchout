import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from 'nestjs-config';
import { GhostModule } from './port/module/ghost.module';
import * as path from 'path';
import {UserModule} from './port/module/user.module';
import {ItemModule} from './port/module/item.module';
import {TransactionModule} from './port/module/transaction.module';
import {DatabaseModule} from './port/module/database.module';

@Module({
  imports: [
    ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
    GhostModule,
    ItemModule,
    TransactionModule,
    UserModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
