import { DeepPartial, EntityRepository, Repository, SaveOptions } from 'typeorm';
import { Ghost } from '../../../domain/ghost/ghost.entity';

@EntityRepository(Ghost)
export class GhostRepository extends Repository<Ghost> implements IGhostRepository {

}

interface IGhostRepository {
  findOne(id?: string): Promise<Ghost | undefined>;
  save(entity: Ghost): Promise<Ghost>;
}
