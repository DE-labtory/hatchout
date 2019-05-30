import {Injectable} from '@nestjs/common';
import {InjectConfig} from 'nestjs-config';

@Injectable()
export class AbiConfig {
    constructor(@InjectConfig() private config) {
    }

    getAuctionAbi() {
        const abi = this.config.get('auction.abi');
        return abi;
    }

    getGhostAbi() {
        const abi = this.config.get('ghost.abi');
        return abi;
    }
}
