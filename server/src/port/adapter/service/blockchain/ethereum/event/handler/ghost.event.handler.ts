import {Inject, Injectable} from '@nestjs/common';
import {GhostService} from '../../../../../../../app/ghost/ghost.service';
import {EventData} from 'web3-eth-contract';
import {EventHandler} from './event.handler';
import {GhostDto} from '../../../../../../../app/ghost/dto/ghost.dto';

@Injectable()
export class GhostHandler implements EventHandler {
    constructor(@Inject('GhostService') private ghostService: GhostService) {
    }

    public async callService(eventData: EventData[]): Promise<void> {
        for (const data of eventData) {
            if (data.event === 'Birth') {
                await this.createEgg(data);
            }
            if (data.event === 'LevelUp') {
                await this.levelUp(data);
            }
            if (data.event === 'Transfer') {
                await this.transfer(data);
            }
        }
    }

    async createEgg(event: EventData): Promise<void> {
        const {
            owner,
            gene,
        } = event.returnValues;
        await this.ghostService.createEgg(new GhostDto(owner, gene));
    }

    async levelUp(event: EventData): Promise<void> {
        const {
            gene,
            level,
        } = event.returnValues;
        await this.ghostService.levelUp(gene, level);
    }

    async transfer(event: EventData): Promise<void> {
        const {
            from,
            to,
            gene,
        } = event.returnValues;
        await this.ghostService.transfer(from, to, gene);
    }
}
