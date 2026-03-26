import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { from, interval,Observable } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import {CountdownService} from './countdown.Service'
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'countDown-app';
  timeCountDown: number = 60;
  countdown$!: Observable<string>
  constructor(private countdownService: CountdownService) {}

  ngOnInit() {
    this.countdown$ = this.countdownService.getCountdown(this.timeCountDown).pipe(
    map(value => value.toString())

    );
  }
}
