import {Injectable, NotFoundException} from '@nestjs/common';
import {Ghost} from '../../domain/ghost/ghost.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {IGhostRepository} from '../../domain/ghost/ghost.repository';
import {User} from '../../domain/user/user.entity';
import {IUserRepository} from '../../domain/user/user.repository';
import {ValidationException} from '../../domain/exception/ValidationException';
import {GhostService} from './ghost.service';

@Injectable()
export class GhostServiceImpl implements GhostService {
  constructor(@InjectRepository(Ghost) private ghostRepository: IGhostRepository, @InjectRepository(User) private userRepository: IUserRepository) {
  }

  async getById(id: number): Promise<Ghost> {
    const ghost = await this.ghostRepository.findById(id);
    if (ghost === undefined) {
      throw new NotFoundException('ghost with the id is not found');
    }
    return ghost;
  }

  async getByGene(gene: string): Promise<Ghost> {
    const ghost = await this.ghostRepository.findByGene(gene);
    if (ghost === undefined) {
      throw new NotFoundException('ghost with the gene is not found');
    }
    return ghost;
  }

  async getByUser(userAddress: string): Promise<Ghost[]> {
    const ghosts = await this.ghostRepository.findByUserAddress(userAddress);
    // todo: check if length is 0 when repository doesn't find at all
    if (ghosts.length === 0) {
      throw new NotFoundException('ghost with the userAddress is not found');
    }
    return ghosts;
  }

  async getByPage(page: number): Promise<Ghost[]> {
    // todo: apply pagination correctly
    if (page < 1 || 25 < page) {
      throw new ValidationException('not allowed page');
    }

    return await this.ghostRepository.findByPage(page);
  }

  async createEgg(gene: string, tokenId: number, ownerAddress: string): Promise<Ghost> {
    const ghost = await this.ghostRepository.findByGene(gene);
    if (ghost !== undefined) {
      throw new ValidationException('this gene is already registered');
    }
    return await this.ghostRepository.save(new Ghost(gene, tokenId, ownerAddress));
  }

  async transfer(from: string, to: string, gene: string): Promise<Ghost> {
    const exOwner: User = await this.userRepository.findByAddress(from);
    if (exOwner === undefined) {
      throw new NotFoundException(`user doesn't exist`);
    }

    // todo: check refactor - if can move logic to domain.
    if (!await this.isOwning(exOwner, gene)) {
      throw new ValidationException(`user doesn't own gene`);
    }

    const newOwner: User = await this.userRepository.findByAddress(to);
    if (newOwner === undefined) {
      throw new NotFoundException(`user doesn't exist`);
    }

    const ghost = await this.ghostRepository.findByGene(gene);
    if (ghost === undefined) {
      throw new NotFoundException(`ghost doesn't exist`);
    }

    return await this.ghostRepository.save(ghost.changeUser(newOwner));
  }

  async increaseLevel(gene: string, amount: number): Promise<Ghost> {
    const ghost = await this.ghostRepository.findByGene(gene);
    if (ghost  === undefined) {
      throw new NotFoundException(`ghost doesn't exist`);
    }

    return await this.ghostRepository.save(ghost.increaseLevel(amount));
  }

  private async isOwning(user: User, gene: string) {
    // todo: check when ghosts none;
    const ghosts: Ghost[] = await this.ghostRepository.findByUserAddress(user.getAddress());
    return ghosts.some((ghost) => ghost.getGene() === gene);
  }
}
