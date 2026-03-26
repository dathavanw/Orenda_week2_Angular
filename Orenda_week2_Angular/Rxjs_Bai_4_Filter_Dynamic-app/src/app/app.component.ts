import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Employee } from './employee.model';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,AsyncPipe,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Bai_4_Filter_Dynamic-app';

  private employeesRaw: Employee[] = [
    { id: 1, name: 'Nguyễn Văn An', position: 'Developer' },
    { id: 2, name: 'Trần Thị Bình', position: 'Designer' },
    { id: 3, name: 'Lê Văn Cường', position: 'Manager' },
    { id: 4, name: 'Phạm Minh Đức', position: 'Developer' },
  ];

  private employeeSub = new BehaviorSubject<Employee[]>(this.employeesRaw);
  filterControl = new FormControl('');
  finalEmployee!: Observable<Employee[]>;


  ngOnInit(): void {
    this.finalEmployee = combineLatest([
      this.employeeSub.asObservable(),
      this.filterControl.valueChanges.pipe(startWith(''))
    ]).pipe(
      map(([employeess, filterEmployee]) => {
       const term = filterEmployee?.toLowerCase() || '';
      return employeess.filter(emp => 
        emp.name.toLowerCase().includes(term)
      );
      })
    )
  }
}
