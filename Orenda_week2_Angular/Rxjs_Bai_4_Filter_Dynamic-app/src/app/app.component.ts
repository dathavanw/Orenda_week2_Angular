import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Employee } from './employee.model';
import { AsyncPipe } from '@angular/common';
import { EmployeeService } from './employee.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Bai_4_Filter_Dynamic-app';

  filterControl = new FormControl('');
  finalEmployee!: Observable<Employee[]>;

  constructor(private employeeService: EmployeeService) { }


  ngOnInit(): void {
    this.finalEmployee = combineLatest([
      this.employeeService.getEmployees(),
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
