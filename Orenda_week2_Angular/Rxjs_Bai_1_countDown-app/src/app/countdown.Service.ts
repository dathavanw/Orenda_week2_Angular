import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Injectable } from '@angular/core';
import { interval,startWith, Observable } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class CountdownService {
 getCountdown(startSeconds: number): Observable<number> {
    return interval(1000).pipe(
      map(value => startSeconds - value),
      takeWhile(value => value >= 0),
      startWith(startSeconds) 
    );
  }
}
