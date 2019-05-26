import {Inject, Injectable} from '@nestjs/common';
import {BridgeService} from './bridge.service';
import {ValidationService} from './validation.service';

@Injectable()
export class ValidationServiceImpl implements ValidationService {

    constructor(@Inject('BridgeService') private bridgeService: BridgeService) {}

    public verify(data: {address: string, message: string}, signature: string): boolean {
        return data.address === this.bridgeService.recover(data.message, signature);
    }
}
