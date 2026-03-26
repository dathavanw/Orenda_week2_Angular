import { Injectable } from '@angular/core';
import { of, Observable, delay } from 'rxjs';
import { User, Department } from './data.model';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  getUsers(): Observable<User[]> {
    const users: User[] = [
      { id: 1, name: 'An', deptId: 101 },
      { id: 2, name: 'Bình', deptId: 102 },
      { id: 3, name: 'Chi', deptId: 101 }
    ];
    return of(users).pipe(delay(1000));
  }

  getDepartments(): Observable<Department[]> {
    const depts: Department[] = [
      { id: 101, name: 'Phòng Nhân Sự' },
      { id: 102, name: 'Phòng Kỹ Thuật' }
    ];
    return of(depts).pipe(delay(2000));
  }
}