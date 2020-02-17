import {EntityRepository, Repository} from 'typeorm';
import {Ghost} from '../../../domain/ghost/ghost.entity';
import {IGhostRepository} from '../../../domain/ghost/ghost.repository';

@EntityRepository(Ghost)
export class GhostRepository extends Repository<Ghost> implements IGhostRepository {
  async findByGene(gene: string): Promise<Ghost> {
    return await this.findOne({gene});
  }
  async findByUserAddress(userAddress: string): Promise<Ghost[]> {
    return await this.find({where: {userAddress}});
  }
  async findById(id: number): Promise<Ghost> {
    return await this.findOne(id);
  }
  async findByPage(page: number): Promise<Ghost[]> {
    return await this.find({
      // todo: remove 25, and put it on config
      take: 25,
      skip: 25 * (page - 1),
    });
  }

}
