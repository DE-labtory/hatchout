import { Module } from '@nestjs/common';
import {GhostController} from '../../web/ghost/ghost.controller';
import {GhostServiceImpl} from '../../app/ghost/ghost.service.impl';

@Module({
    controllers: [GhostController],
    providers: [
        {
            provide: 'GhostService',
            useClass: GhostServiceImpl,
        },
    ],
})
export class GhostModule {}
