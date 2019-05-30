import {Module} from '@nestjs/common';
import {Event} from './event';
import {EventServiceModule} from './event.service.module';

export const eventProvider = {
    provide: 'EVENT',
    useClass: Event,
};

@Module({
    providers: [eventProvider],
    imports: [EventServiceModule],
    exports: [eventProvider],
})
export class EventModule {
}
