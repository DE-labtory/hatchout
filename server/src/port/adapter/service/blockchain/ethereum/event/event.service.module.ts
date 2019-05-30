import {Module} from '@nestjs/common';
import {EventService} from './event.service';
import {Web3Module} from '../web3/web3.module';
import {Web3Config} from '../web3/web3.config';
import {ContractFactoryModule} from '../web3/contract/contract.module';

export const eventServiceProvider = {
    provide: 'EVENT_SERVICE',
    useClass: EventService,
};

@Module({
    providers: [EventService, Web3Config, eventServiceProvider],
    imports: [Web3Module, ContractFactoryModule],
    exports: [eventServiceProvider],
})
export class EventServiceModule {
}
