import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { from, interval } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'countDown-app';
  timeCountDown: number = 60;
  ngOnInit() {
    const timer = interval(1000).pipe(map(value => 60 - value), takeWhile(value => value >= 0));
    timer.subscribe(value => {
      this.timeCountDown = value;
      console.log('Giây còn lại: ', value);
    })
  }
}
