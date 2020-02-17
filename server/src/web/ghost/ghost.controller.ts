import {Body, Controller, Get, Inject, Injectable, Param, Post, Put, Query} from '@nestjs/common';
import {Ghost} from '../../domain/ghost/ghost.entity';
import {GhostDto} from '../../app/ghost/dto/ghost.dto';
import {QueryParamDto} from '../../app/ghost/dto/query.param.dto';
import {GhostService} from '../../app/ghost/ghost.service';

@Injectable()
@Controller('ghosts')
export class GhostController {
  constructor(@Inject('GhostService') private service: GhostService) {}

  @Get(':id')
  async getById(@Param('id') id: number): Promise<Ghost> {
      return await this.service.getById(id);
  }

  @Get()
  async get(@Query('gene') gene: string, @Query('userAddress') userAddress, @Query('page') page: number): Promise<Ghost[]> {
    let ghosts: Ghost[] = [];
    // todo: refac
    if (gene !== undefined) {
      ghosts.push(await this.service.getByGene(gene));
    } else if (userAddress !== undefined) {
      ghosts = await this.service.getByUser(userAddress);
    } else if (page !== undefined) {
      ghosts = await this.service.getByPage(page);
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
