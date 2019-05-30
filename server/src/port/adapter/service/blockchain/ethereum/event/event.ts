import {Inject, Injectable} from '@nestjs/common';
import {EventList} from './list/event';
import {EventService} from './event.service';

@Injectable()
export class Event {
    constructor(@Inject('EVENT_SERVICE') private event: EventService) {
    }

    getEvents(event: EventList): void {
        setInterval(() => this.event.getEvents(event));
    }
}
