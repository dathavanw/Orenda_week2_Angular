import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { forkJoin, of, delay } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserWithDept } from './data.model';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'Bai_5_KetHop2Api-app';

  userWithDepartment: UserWithDept[] = [];
  isLoading = false;

  constructor(private dataService: DataService) {}


  ngOnInit(): void {
    this.isLoading = true;
    forkJoin([this.dataService.getUsers(), this.dataService.getDepartments()]).pipe(
      map(([users, depts]) => {
        return users.map(user => {
          const dept = depts.find(d => d.id === user.deptId);
          return {
            ...user,
            departmentName : dept?.name || "Không xác định"
          };
        });
      })
    ).subscribe({
      next: (data) => {
        this.userWithDepartment = data;
        this.isLoading = false;
        console.log("Đã đợi dữ liệu cả 2 bên", data);
      },
      error: (err) => console.error("Lỗi xử lý", err)
    });
  }
}
