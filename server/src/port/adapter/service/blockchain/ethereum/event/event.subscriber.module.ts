import {Module} from '@nestjs/common';
import {EventSubscriber} from './event.subscriber';
import {Web3Module} from '../web3/web3.module';
import {Web3Config} from '../web3/web3.config';

export const eventSubscriber = {
    provide: 'EVENT_SUBSCRIBER',
    useClass: EventSubscriber,
};

@Module({
    providers: [EventSubscriber, Web3Config, eventSubscriber],
    imports: [Web3Module],
    exports: [eventSubscriber],
})
export class EventSubscriberModule {
}
