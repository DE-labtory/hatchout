import {Injectable} from '@nestjs/common';
import {Contracts} from '../web3/contract/contracts';
import {EventHandler} from './handler/event.handler';
import {EventData} from 'web3-eth-contract';

@Injectable()
export class EventSubscriber {
    constructor(private eventHandler: EventHandler) {
        this.contractList = this.eventHandler.getContractList();
    }

    contractList: Contracts[];
    currentBlockNum: number;

    async trackEvents(): Promise<void> {
        this.currentBlockNum = await this.eventHandler.getBlockNum();
        for (const index in this.contractList) {
            if (this.contractList[index].blockNum !== this.currentBlockNum) {
                const datas: EventData[]
                    = await this.contractList[index].contract.getPastEvents('allEvents', {
                    fromBlock: this.contractList[index].blockNum,
                    toBlock: 'latest',
                });
                this.contractList[index].blockNum++;
                await this.eventHandler.parseData(datas);
            }
        }
    }

    subscribeEvents(): void {
        setInterval(() => this.trackEvents(), 1000);
    }
}
