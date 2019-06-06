import { Injectable } from '@nestjs/common';
import { BridgeService } from './bridge.service';

@Injectable()
export class BridgeServiceImpl implements BridgeService {
    recover(message: string, signature: string): string {
        return '';
    }
}
