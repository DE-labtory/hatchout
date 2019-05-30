import {Module} from '@nestjs/common';
import {AbiConfig} from './abi.config';
import {Web3Config} from '../web3.config';

export const abiProvider = {
    provide: 'ABI',
    useClass: AbiConfig,
};

@Module({
    providers: [Web3Config, abiProvider],
    exports: [abiProvider],
})
export class AbiModule {
}
