import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationService } from './Notification.Service';

import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Bai_8_Realtime_Application';
  constructor(public notificationService: NotificationService) {}

  onReset() {
    this.notificationService.markAsRead();
  }
}
