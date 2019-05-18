import { DeepPartial, EntityRepository, Repository, SaveOptions } from 'typeorm';
import { Ghost } from '../../../domain/ghost/ghost.entity';

export interface IGhostRepository {
  findOne(id?: string): Promise<Ghost | undefined>;
  save(entity: Ghost): Promise<Ghost>;
}
