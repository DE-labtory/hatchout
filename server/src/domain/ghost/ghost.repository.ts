import {Ghost} from './ghost.entity';
import {FindConditions, FindManyOptions, FindOneOptions} from 'typeorm';

export interface IGhostRepository {
  save(entity: Ghost): Promise<Ghost>;
  findById(id: number): Promise<Ghost>;
  findByGene(gene: string): Promise<Ghost>;
  findByUserAddress(userAddress: string): Promise<Ghost[]>;
  findByPage(page: number): Promise<Ghost[]>;
}
