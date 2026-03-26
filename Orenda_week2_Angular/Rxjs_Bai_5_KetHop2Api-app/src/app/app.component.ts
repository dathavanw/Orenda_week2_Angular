import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { forkJoin, of, delay } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, Department, UserWithDept } from './data.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'Bai_5_KetHop2Api-app';

  // Trả về danh sách User
  getUsers() {
    const users: User[] = [
      { id: 1, name: 'An', deptId: 101 },
      { id: 2, name: 'Bình', deptId: 102 },
      { id: 3, name: 'Chi', deptId: 101 }
    ];
    return of(users).pipe(delay(1000));
  }

  // Trả về danh sách phòng ban 
  getDepartments() {
    const depts: Department[] = [
      { id: 101, name: 'Phòng Nhân Sự' },
      { id: 102, name: 'Phòng Kỹ Thuật' }
    ];
    return of(depts).pipe(delay(2000));
  }

  userWithDepartment: UserWithDept[] = [];
  isLoading = false;

  ngOnInit(): void {
    this.isLoading = true;
    forkJoin([this.getUsers(), this.getDepartments()]).pipe(
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
