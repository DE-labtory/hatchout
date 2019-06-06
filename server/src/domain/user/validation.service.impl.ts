import {Inject, Injectable} from '@nestjs/common';
import {ValidationService} from './validation.service';
import { BridgeService } from './bridge.service';
import { Web3BridgeService } from '../../port/adapter/service/blockchain/ethereum/web3/web3.bridge.service';

@Injectable()
export class ValidationServiceImpl implements ValidationService {

    constructor(@Inject('BridgeService') private bridgeService: Web3BridgeService) {}

    public verify(address: string, message: string, signature: string): boolean {
        return address === this.bridgeService.recover(message, signature);    // signature를 복호화 해서 진짜 public key와 맞는지 확인.
    }
}
