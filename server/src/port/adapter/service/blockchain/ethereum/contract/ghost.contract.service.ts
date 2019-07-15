import {Contract} from 'web3-eth-contract';
import Web3 from 'web3';
import {Inject, Injectable} from '@nestjs/common';
import {EventData} from 'web3-eth-contract';
import {InjectConfig} from 'nestjs-config';
import {GhostHandler} from '../event/handler/ghost.event.handler';

@Injectable()
export class GhostContractService {
    private ghostContract: Contract;
    private currentNum: number;

    constructor(@Inject('WEB3') private web3: Web3, @InjectConfig() private config,
                private ghostEventHandler: GhostHandler) {
        this.createContract();
    }

    private createContract(): void {
        this.ghostContract = new this.web3.eth.Contract(this.config.get('ghost.abi'), this.config.get('ghost.address'));
    }

    watchGhostEvents() {
        setInterval(async () => {
            const blockNum = await this.web3.eth.getBlockNumber();
            if (blockNum === this.currentNum) {
                console.log('nothing');
            } else {
                const eventData: EventData[]
                    = await this.ghostContract.getPastEvents('allEvents', {
                    fromBlock: this.currentNum,
                    toBlock: this.currentNum,
                });
                await this.ghostEventHandler.callService(eventData);
                this.currentNum++;
            }
        });
    }

    public watch() {
        this.watchGhostEvents();
    }
}
