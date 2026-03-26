import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Customer } from './Model/customer.model';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { Component, OnInit } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { CustomerService } from './Service/customer.service';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { catchError, map, Observable, of, switchMap, timer } from 'rxjs';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    CommonModule,
    RouterOutlet,
    NzTableModule,
    NzDividerModule,
    NzIconModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzModalModule,
    NzInputNumberModule,
    NzInputModule,
    NzDescriptionsModule,
    NzMessageModule,
  ],
})
export class AppComponent implements OnInit {
  title = 'Mannger Customer';
  isEdit = false;
  currentEditId: number | null = null;
  isVisibleDelete = false;
  idToDelete: number | null = null; // Lưu ID của khách hàng muốn xóa
  isVisibleDetail = false;
  selectedCustomer: Customer | null = null;
  validateForm!: FormGroup;
  isVisible = false;

  constructor(private fb: FormBuilder,
    private message: NzMessageService,
    public customerService: CustomerService
  ) { }

  showModal(): void {
    this.isVisible = true;
  }
  // 1. Hàm mở Popup xác nhận
  showDeleteModal(id: number): void {
    this.idToDelete = id;
    this.isVisibleDelete = true;
  }
  viewCustomerDetail(data: Customer): void {
    this.selectedCustomer = data;
    this.isVisibleDetail = true;
  }
  handleCloseDetail(): void {
    this.isVisibleDetail = false;
    this.selectedCustomer = null;
  }
  // 2. Hàm khi nhấn "Hủy" trên Popup Xóa
  handleCancelDelete(): void {
    this.isVisibleDelete = false;
    this.idToDelete = null;
  }

  // Khi bấm nút "Thêm khách hàng" ở ngoài bảng, hãy gọi hàm này:
  prepareAdd(): void {
    this.isEdit = false;
    this.validateForm.controls['customerCode'].enable();
    this.validateForm.reset();
    this.showModal();
  }


  duplicateCodeValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) return of(null);

      return timer(500).pipe(
        switchMap(() => this.customerService.checkDuplicateCode(control.value)),
        map((res: any[]) => {
          const isDuplicate = res && res.length > 0;
          return isDuplicate ? { duplicated: true } : null;
        }),
        first(),
        catchError(() => of(null))
      );
    };
  }


  handleOk(): void {
    if (this.validateForm.valid) {
      const formData = this.validateForm.getRawValue();
      if (this.isEdit) {
        this.customerService.updateCustomer(this.currentEditId!, formData).subscribe(() => {
          this.message.success('Cập nhật thông tin khách hàng thành công!');
        });
      }
      else {
        this.customerService.addCustomer(formData).subscribe(() => {
          this.pageIndex = 1; // Reset về trang 1 khi thêm mới
          this.message.success('Thêm mới khách hàng thành công!');
        });
      }
      this.afterActionSuccess();
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }


  editCustomer(data: Customer): void {
    this.isEdit = true; // Đánh dấu là đang Sửa
    this.currentEditId = data.id; // Lưu lại ID để biết lát nữa lưu đè vào đâu
    this.validateForm.controls['customerCode'].disable();
    // Đổ dữ liệu cũ vào các ô Input
    this.validateForm.patchValue({
      customerCode: data.customerCode,
      fullName: data.fullName,
      age: data.age,
      address: data.address
    });
    this.showModal(); // Mở Popup lên
  }
  handleCancel(): void {
    this.isVisible = false;
  }


  // 3. Hàm khi nhấn "OK" trên Popup Xóa (Thực hiện xóa thật)
  handleOkDelete(): void {
    if (this.idToDelete !== null) {
      this.customerService.deleteCustomer(this.idToDelete).subscribe(() => {
        this.isVisibleDelete = false;
        this.loadDataFromServer(this.pageIndex, this.pageSize);
        this.message.success('Đã xóa khách hàng khỏi hệ thống!');
      });
    }
  }


  displayData: Customer[] = [];
  loading = false;
  pageSize = 3;
  pageIndex = 1;
  total = 0; // Tổng số bản ghi

  ngOnInit(): void {
    this.loadDataFromServer(this.pageIndex, this.pageSize);
    this.validateForm = this.fb.group({
      customerCode: [null, [Validators.required], [this.duplicateCodeValidator()]],
      fullName: [null, [Validators.required]],
      age: [null, [Validators.required]],
      address: [null, [Validators.required]]
    });
  }


  loadDataFromServer(pageIndex: number, pageSize: number): void {
    this.loading = true;
    this.customerService.loadDataFromServer(pageIndex, pageSize).subscribe(res => {
      const body = res.body;

      if (body && body.data) {
        this.displayData = body.data;
        this.total = body.items;
      } else {
        this.displayData = body || [];
        this.total = Number(res.headers.get('x-total-count')) || 0;
      }
      this.loading = false;
    });
  }


  onQueryParamsChange(params: any): void {
    const { pageIndex, pageSize } = params;
    this.loadDataFromServer(pageIndex, pageSize);
  }


  afterActionSuccess(): void {
    this.validateForm.reset();
    this.isVisible = false;
    this.loadDataFromServer(this.pageIndex, this.pageSize);
  }
}
