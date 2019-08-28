import {Controller, Get, Inject, Injectable, Param, Query} from '@nestjs/common';
import {Ghost} from '../../domain/ghost/ghost.entity';
import {GhostService} from '../../app/ghost/ghost.service';

@Injectable()
@Controller('ghost')
export class GhostController {
    constructor(@Inject('GhostService') private service: GhostService) {}

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Ghost> {
        return await this.service.findOne(id);
    }

    @Get()
    async findOneByGene(@Query('gene') gene): Promise<Ghost> {
        return await this.service.findOneByGene(gene);
    }

    @Get()
    async findAllByUser(@Query('userId') userId): Promise<Ghost[]> {
        return await this.service.findAllByUser(userId);
    }

    @Get(':page')
    async findAll(@Param('page') page: number): Promise<Ghost[]> {
        return await this.service.findAll(page);
    }
}
