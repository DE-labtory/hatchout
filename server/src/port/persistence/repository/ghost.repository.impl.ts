import {EntityRepository, Repository} from 'typeorm';
import {Ghost} from '../../../domain/ghost/ghost.entity';
import {IGhostRepository} from '../../../domain/ghost/ghost.repository';

@EntityRepository(Ghost)
export class GhostRepository extends Repository<Ghost> implements IGhostRepository {}
