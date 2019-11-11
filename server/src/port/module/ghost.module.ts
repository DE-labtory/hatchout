import { Module } from '@nestjs/common';
import {GhostService} from '../../app/ghost/ghost.service';
import {GhostController} from '../../web/ghost/ghost.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {GhostRepository} from '../persistence/repository/ghost.repository.impl';

@Module({
    controllers: [GhostController],
    providers: [
        {
            provide: 'GhostService',
            useClass: GhostService,
        },
    ],
})
export class GhostModule {}
