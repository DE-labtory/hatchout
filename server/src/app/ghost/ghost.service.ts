import {Injectable} from '@nestjs/common';
import {IGhostRepository} from '../../domain/ghost/ghost.repository';
import {Ghost} from '../../domain/ghost/ghost.entity';

@Injectable()
export class GhostService {
  constructor(private readonly ghostRepository: IGhostRepository) {
  }

  async findOne(id: number): Promise<Ghost> {
    return await this.ghostRepository.findOne(id);
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
}
