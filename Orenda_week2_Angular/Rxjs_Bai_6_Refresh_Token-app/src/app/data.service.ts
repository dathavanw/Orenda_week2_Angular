import { Injectable } from '@angular/core';
import { of, throwError, Observable, delay, switchMap, catchError, tap, retry } from 'rxjs';
import { Employee } from './employee.model';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root' // Giúp Service này có thể dùng ở bất cứ đâu
})

export class DataService {
    constructor(private router: Router) { }
    private accessToken = 'KEY_OLD';
    private isRefreshTokenValid = false;  // thay đổi giá trị false để thấy refresh thất bại 


    getEmployees(): Observable<Employee[]> {
        console.log(`Đang gọi API với khóa: ${this.accessToken}`);
        if (this.accessToken === 'KEY_OLD') {
            return throwError(() => ({ status: 401, message: 'Unauthorized' }));
        }

        const mockData: Employee[] = [
            { id: 1, name: 'Nguyễn Văn An' },
            { id: 2, name: 'Trần Thị Bình' }
        ];
        return of(mockData).pipe(delay(1000));
    }



    refreshToken(): Observable<string> {
        console.log('Đang đi đổi chìa khóa mới...');
        return of('KEY_NEW').pipe(
            delay(1500),
            tap(token => {
                this.accessToken = token;
            }),
            switchMap(() => {
                if (!this.isRefreshTokenValid) {
                    return throwError(() => ({ status: 403 }));
                }
                return of('KEY_NEW');
            })
        );
    }

    getEmployeesWithRefresh(): Observable<Employee[]> {
        return this.getEmployees().pipe(
            catchError(error => {
                if (error.status === 401) {
                    console.warn('Token hết hạn, đang refresh...');

                    return this.refreshToken().pipe(
                        switchMap(() => {
                            return this.getEmployees();
                        })
                    );
                }

                return throwError(() => error);
            }),
            catchError(err => {
                console.error('Refresh Token thất bại!');
                this.router.navigate(['/login']);
                return throwError(() => err);
            })
        );
    }
}
