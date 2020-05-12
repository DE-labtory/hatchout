import {EventData} from 'web3-eth-contract';

export interface EventHandler {
    callService(eventData: EventData[]): void;
}
