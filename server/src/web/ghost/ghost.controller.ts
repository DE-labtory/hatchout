import {Body, Controller, Get, Inject, Injectable, Param, Post, Put, Query} from '@nestjs/common';
import {Ghost} from '../../domain/ghost/ghost.entity';
import {GhostService} from '../../app/ghost/ghost.service';
import {GhostDto} from '../../app/ghost/dto/ghost.dto';
import {QueryParamDto} from '../../app/ghost/dto/query.param.dto';

@Injectable()
@Controller('ghosts')
export class GhostController {
  constructor(@Inject('GhostService') private service: GhostService) {}

  @Get(':id')
  async getById(@Param('id') id: number): Promise<Ghost> {
      return await this.service.get(id);
  }

  @Get()
  async get(@Query() params: QueryParamDto): Promise<Ghost[]> {
    let ghosts: Ghost[] = [];
    if (params.gene !== undefined) {
      ghosts.push(await this.service.getByGene(params.gene));
    } else if (params.userAddress !== undefined) {
      ghosts = await this.service.getByUser(params.userAddress);
    } else if (params.page !== undefined) {
      ghosts = await this.service.getByPage(params.page);
    }

    return ghosts;
  }

  @Post()
  async create(@Body() ghostDto: GhostDto): Promise<Ghost> {
    return await this.service.createEgg(ghostDto.gene, ghostDto.tokenId, ghostDto.owner);
  }

  @Put()
  // todo: check body
  async transfer(@Body() from: string, to: string, gene: string): Promise<Ghost> {
    return await this.service.transfer(from, to, gene);
  }

  @Put()
  // todo: check body
  async increaseLevel(@Body() gene: string, amount: number): Promise<Ghost> {
    return await this.service.increaseLevel(gene, amount);
  }
}
