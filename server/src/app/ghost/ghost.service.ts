import {Ghost} from '../../domain/ghost/ghost.entity';

export interface GhostService {
  getById(id: number): Promise<Ghost>;
  getByGene(gene: string): Promise<Ghost>;
  getByUser(userAddress: string): Promise<Ghost[]>;
  getByPage(page: number): Promise<Ghost[]>;
  createEgg(gene: string, tokenId: number, ownerAddress: string);
  transfer(from: string, to: string, gene: string): Promise<Ghost>;
  increaseLevel(gene: string, amount: number): Promise<Ghost>;
}
