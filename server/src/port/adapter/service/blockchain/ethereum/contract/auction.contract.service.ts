import {Contract} from 'web3-eth-contract';
import Web3 from 'web3';
import {Inject, Injectable} from '@nestjs/common';
import {EventData} from 'web3-eth-contract';
import {InjectConfig} from 'nestjs-config';
import {AuctionHandler} from '../event/handler/auction.event.handler';

@Injectable()
export class AuctionContractService {
    private auctionContract: Contract;
    private currentNum: number;

    constructor(@Inject('WEB3') private web3: Web3, @InjectConfig() private config,
                private auctionEventHandler: AuctionHandler) {
        this.createContract();
    }

    private createContract(): void {
        this.auctionContract = new this.web3.eth.Contract(this.config.get('auction.abi'), this.config.get('auction.address'));
    }

    watchAuctionEvents() {
        setInterval(async () => {
            const blockNum = await this.web3.eth.getBlockNumber();
            if (blockNum === this.currentNum) {
                // Nothing happen
            } else {
                const eventData: EventData[]
                    = await this.auctionContract.getPastEvents('allEvents', {
                    fromBlock: this.currentNum,
                    toBlock: this.currentNum,
                });
                await this.auctionEventHandler.callService(eventData);
                this.currentNum++;
            }
        }, 1000);
    }

    public watch() {
        this.watchAuctionEvents();
    }
}
