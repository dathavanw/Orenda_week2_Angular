import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee } from './employee.model';


@Injectable({
    providedIn: 'root'
})
export class EmployeeService {

    private employeesRaw: Employee[] = [
        { id: 1, name: 'Nguyễn Văn An', position: 'Developer' },
        { id: 2, name: 'Trần Thị Bình', position: 'Designer' },
        { id: 3, name: 'Lê Văn Cường', position: 'Manager' },
        { id: 4, name: 'Phạm Minh Đức', position: 'Developer' },
    ];

    private employeeSub = new BehaviorSubject<Employee[]>(this.employeesRaw);
    constructor() { }

    getEmployees(): Observable<Employee[]> {
        return this.employeeSub.asObservable();
    }
}