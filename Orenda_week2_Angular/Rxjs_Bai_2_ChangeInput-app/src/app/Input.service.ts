import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InputService {
  formatInputStream(element: HTMLInputElement): Observable<string> {
    return fromEvent(element, 'input').pipe(
      map((event: any) => event.target.value)
    );
  }
}