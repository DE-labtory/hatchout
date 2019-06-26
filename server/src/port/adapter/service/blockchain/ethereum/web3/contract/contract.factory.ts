import {Inject, Injectable} from '@nestjs/common';
import Web3 from 'web3';
import {InjectConfig} from 'nestjs-config';
import {Contracts} from './contracts';

@Injectable()
export class ContractFactory {
    contracts: Contracts[];

    constructor(@Inject('WEB3') private web3: Web3, @InjectConfig() private config) {
        this.setContracts();
    }

    setContracts(): void {
        this.contracts[0] = new Contracts('Auction', this.config.get('subscriber.startBlock'),
            new this.web3.eth.Contract(this.config.get('auction.abi'), this.config.get('auction.address')));
        this.contracts[1] = new Contracts('Ghost', this.config.get('subscriber.startBlock'),
            new this.web3.eth.Contract(this.config.get('ghost.abi'), this.config.get('ghost.address')));
    }

    getContracts(): Contracts[] {
        return this.contracts;
    }
}
