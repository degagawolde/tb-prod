import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppEventType } from './event.type';
import { AppEvent } from './app.event';

@Injectable({
    providedIn: 'root'
})
export class EventQueueService {

    private eventBroker = new Subject<AppEvent<any>>();

    on(eventType: AppEventType): Observable<AppEvent<any>> {
        return this.eventBroker.pipe(filter(event => event.type === eventType));
    }

    brodcast<T>(event: AppEvent<T>): void {
        this.eventBroker.next(event);
    }

}