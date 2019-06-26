import {Module} from '@nestjs/common';
import {ContractFactory} from './contract.factory';
import {Web3Config} from '../web3.config';
import {Web3Module} from '../web3.module';

export const contractProvider = {
    provide: 'CONTRACT',
    useClass: ContractFactory,
};

@Module({
    providers: [Web3Config, contractProvider],
    exports: [contractProvider],
    imports: [Web3Module],
})
export class ContractFactoryModule {
}
