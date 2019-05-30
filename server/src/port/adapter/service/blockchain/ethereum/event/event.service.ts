import {Inject, Injectable} from '@nestjs/common';
import {Contract} from 'web3-eth-contract';
import {EventList} from './list/event';

@Injectable()
export class EventService {
    private eventIndex: number = 0;

    constructor(@Inject('CONTRACT') private contract) {
    }

    async getEvents(event: EventList) {
        const contract: Contract = this.contract.getInstance(event);
        const data = await contract.getPastEvents(event, {
            fromBlock: 0,
            toBlock: 'latest',
        });
        this.eventIndex++;
        return data[this.eventIndex].returnValues;
    }
}
