import {Injectable} from '@nestjs/common';
import {Ghost} from '../../domain/ghost/ghost.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {IGhostRepository} from '../../domain/ghost/ghost.repository';
import {GhostDto} from './dto/ghost.dto';

@Injectable()
export class GhostService {
  constructor(@InjectRepository(Ghost) private ghostRepository: IGhostRepository) {
  }

  async findOne(id: number): Promise<Ghost> {
    return await this.ghostRepository.findOne(id);
  }

  async findOneByGene(gene: string): Promise<Ghost> {
    return await this.ghostRepository.findOne(
        {
          gene,
        },
    );
  }

  async findAllByUser(userId: string): Promise<Ghost[]> {
    return await this.ghostRepository.find(
      {
        userId,
      },
    );
  }

  async findAll(page: number): Promise<Ghost[]> {
    if (page < 1) {
      page = 1;
    }
    return await this.ghostRepository.find({
      take: 25,
      skip: 25 * (page - 1),
    });
  }

  async createEgg(ghostDto: GhostDto): Promise<Ghost> {
    const newGhost = new Ghost(ghostDto.gene, 0, ghostDto.owner);
    return await this.ghostRepository.save(newGhost);
  }

  async transfer(from: string, to: string, gene: string): Promise<Ghost> {
    const updatedGhost = await this.ghostRepository.findOne(
        {
          gene,
        },
    );
    updatedGhost.setUserId(to);
    return await this.ghostRepository.save(updatedGhost);
  }

  async levelUp(gene: string, level: number): Promise<Ghost> {
    const updatedGhost = await this.ghostRepository.findOne(
        {
          gene,
        },
    );
    updatedGhost.setLevel(level);
    return await this.ghostRepository.save(updatedGhost);
  }
}
