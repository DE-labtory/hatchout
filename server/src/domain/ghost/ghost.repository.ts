import {Ghost} from './ghost.entity';
import {FindConditions, FindManyOptions, FindOneOptions} from 'typeorm';

export interface IGhostRepository {
  findOne(id?: number): Promise<Ghost | undefined>;
  findOne(conditions?: FindConditions<Ghost>, options?: FindOneOptions<Ghost>): Promise<Ghost | undefined>;
  save(entity: Ghost): Promise<Ghost>;
  find(options?: FindConditions<Ghost> | FindManyOptions<Ghost>): Promise<Ghost[]>;
  findByGene(gene: string): Promise<Ghost>;
  findByUserAddress(userAddress: string): Promise<Ghost[]>;
  findById(id: number): Promise<Ghost>;
  findByPage(page: number): Promise<Ghost[]>;
}
