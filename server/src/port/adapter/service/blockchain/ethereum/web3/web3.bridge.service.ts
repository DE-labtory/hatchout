import {BridgeService} from '../../../../../../domain/user/bridge.service';
import {Inject, Injectable} from '@nestjs/common';
import Web3 from 'web3';
import {SignUpDto} from '../../../../../../app/user/dto/signUp.dto';

@Injectable()
export class Web3BridgeService implements BridgeService {
    constructor(@Inject('WEB3') private web3: Web3) {}

    public recover(message: string, signature: string): string {
        return this.web3.eth.accounts.recover(message, signature);
    }
}
