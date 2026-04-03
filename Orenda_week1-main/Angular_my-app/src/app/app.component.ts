import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Customer } from './Model/customer.model';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { NgForm } from '@angular/forms'
import { FormsModule } from '@angular/forms';

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
    FormsModule,
    NzFormModule,
    NzModalModule,
    NzInputNumberModule,
    NzInputModule,
    NzDescriptionsModule,
    NzMessageModule,
  ],
})
export class AppComponent implements OnInit {
  // Lấy tham chiếu từ HTML (#customerForm)
  @ViewChild('customerForm') customerForm!: NgForm;



  title = 'Mannger Customer';
  isEdit = false;
  currentEditId: number | null = null;
  isVisibleDelete = false;
  idToDelete: number | null = null; // Lưu ID của khách hàng muốn xóa
  isVisibleDetail = false;
  selectedCustomer: Customer | null = null;
  // validateForm!: FormGroup;
  isVisible = false;

  constructor(
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

  cus: Customer = {
    id: 0,
    customerCode: '',
    fullName: '',
    age: 18,
    address: '',
    guardianName: '',
    guardianPhone: ''
  }

  // Khi bấm nút "Thêm khách hàng" ở ngoài bảng, hãy gọi hàm này:
  prepareAdd(): void {
    this.isEdit = false;
    this.cus = {
      id: 0, customerCode: '', fullName: '', age: 18, address: '', guardianName: '',
      guardianPhone: ''
    };
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

    if (this.customerForm && this.customerForm.valid) {

      if (this.isEdit) {
        this.customerService.updateCustomer(this.currentEditId!, this.cus).subscribe(() => {
          this.message.success('Cập nhật thành công!');
          this.afterActionSuccess();
        });
      } else {
        this.customerService.checkDuplicateCode(this.cus.customerCode).subscribe((result) => {
          if (result && result.length > 0) {
            this.message.error("Mã khách hàng đã tồn tại!");
          } else {
            this.customerService.addCustomer(this.cus).subscribe(() => {
              this.message.success("Thêm mới thành công!");
              this.afterActionSuccess();
            });
          }
        });
      }

    } else {
      // Báo lỗi và hiện viền đỏ
      this.message.error('Vui lòng nhập đầy đủ thông tin!');

      if (this.customerForm) {
        Object.values(this.customerForm.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
      }
    }
  }


  editCustomer(data: Customer): void {
    this.isEdit = true; // Đánh dấu là đang Sửa
    this.currentEditId = data.id; // Lưu lại ID để biết lát nữa lưu đè vào đâu
    this.cus = { ...data }
    // this.validateForm.get('customerCode')?.setValue('Nguyễn Văn Bá');
    this.showModal();
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
  pageSize = 10;
  pageIndex = 1;
  total = 0; // Tổng số bản ghi

  ngOnInit(): void {
    this.loadDataFromServer(this.pageIndex, this.pageSize);
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
    this.cus = {
      id: 0, customerCode: '', fullName: '', age: 18, address: '', guardianName: '',
      guardianPhone: ''
    };
    this.isVisible = false;
    this.customerForm?.resetForm(this.cus);
    this.loadDataFromServer(this.pageIndex, this.pageSize);
  }
}
