import {Ghost} from './ghost.entity';
import {FindConditions, FindManyOptions} from 'typeorm';

export interface IGhostRepository {
  findOne(id?: number): Promise<Ghost | undefined>;
  save(entity: Ghost): Promise<Ghost>;
  find(options?: FindConditions<Ghost> | FindManyOptions<Ghost>): Promise<Ghost[]>;
}
