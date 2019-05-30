import {Inject, Injectable} from '@nestjs/common';
import {AbiConfig} from '../abi/abi.config';
import Web3 from 'web3';
import {EventList, EventType} from '../../event/list/event';

@Injectable()
export class ContractFactory {
    constructor(@Inject('WEB3') private web3: Web3,
                @Inject('ABI') private abi: AbiConfig) {
    }

    getInstance(eventType: EventList) {
        switch (EventType[eventType]) {
            case 'Ghost':
                return new this.web3.eth.Contract(this.abi.getGhostAbi());
            case 'Auction':
                return new this.web3.eth.Contract(this.abi.getAuctionAbi());
            default:
                return new this.web3.eth.Contract(this.abi.getAuctionAbi());
        }
    }
}
