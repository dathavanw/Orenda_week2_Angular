import { Injectable } from '@angular/core';
import { interval, Subject, merge, Observable } from 'rxjs';
import { map, scan, startWith } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})

export class NotificationService {
    private reset = new Subject<void>();
    readonly unreadCount$: Observable<number>;

    constructor() {
        const socketStream$ = interval(3000).pipe(map(() => 1));
        const resetStream$ = this.reset.pipe(map(() => 0));

        this.unreadCount$ = merge(socketStream$, resetStream$).pipe(
            // acc: giá trị tích lũy hiện tại, curr: giá trị mới chảy vào (1 hoặc 0)
            scan((acc, curr) => {
                if (curr === 0) return 0; // Nếu là tín hiệu reset -> về 0
                return acc + curr;        // Nếu là thông báo mới -> cộng dồn
            }, 0),
            startWith(0) // Khởi tạo giá trị ban đầu khi vừa load trang
        );
    }

    markAsRead(): void {
        this.reset.next();
    }
}