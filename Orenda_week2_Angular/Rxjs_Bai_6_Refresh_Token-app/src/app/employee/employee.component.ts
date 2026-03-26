import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataService } from '../data.service';
import { Employee } from '../employee.model';


@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [],
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css'
})
export class EmployeeComponent implements OnInit {
  title = 'Bai_6_Refresh_Token-app';

  employees: Employee[] = [];
  statusMessage = 'Đang kiểm tra quyền truy cập...';

  constructor(private dataService: DataService) { }

 ngOnInit() {
    this.dataService.getEmployeesWithRefresh().subscribe({
      next: (data) => {
        this.employees = data;
        this.statusMessage = 'Thành công!';
      },
      error: () => {
        this.statusMessage = 'Có lỗi xảy ra!';
      }
    });
  }
}