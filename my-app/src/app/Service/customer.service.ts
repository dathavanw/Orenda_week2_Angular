import { Injectable } from '@angular/core';
import { Customer } from '../Model/customer.model';
import { BehaviorSubject, delay, Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class CustomerService {
    // 1. Chuyển mảng 'customer' sang đây (giữ nguyên tên biến)
    customer: Customer[] = [
        { id: 1, customerCode: 'KH001', fullName: 'Nguyễn Văn A', age: 25, address: 'Hà Nội' },
        { id: 2, customerCode: 'KH002', fullName: 'Trần Thị B', age: 30, address: 'Đà Nẵng' },
        { id: 3, customerCode: 'KH003', fullName: 'Lê Hoàng Nam', age: 22, address: 'TP. Hồ Chí Minh' },
        { id: 4, customerCode: 'KH004', fullName: 'Phạm Thanh Thảo', age: 28, address: 'Cần Thơ' },
        { id: 5, customerCode: 'KH005', fullName: 'Hoàng Văn Đức', age: 35, address: 'Hải Phòng' },
        { id: 6, customerCode: 'KH006', fullName: 'Đặng Minh Anh', age: 19, address: 'Huế' },
        { id: 7, customerCode: 'KH007', fullName: 'Bùi Thị Ngọc', age: 40, address: 'Nha Trang' },
        { id: 8, customerCode: 'KH008', fullName: 'Ngô Quốc Bảo', age: 27, address: 'Bình Dương' },
        { id: 9, customerCode: 'KH009', fullName: 'Vũ Tuyết Mai', age: 32, address: 'Quảng Ninh' },
        { id: 10, customerCode: 'KH010', fullName: 'Lý Gia Hưng', age: 24, address: 'Đồng Nai' }
    ];

    loadDataFromServer(pageIndex: number, pageSize: number): Observable<Customer[]> {
        const start = (pageIndex - 1) * pageSize;
        const end = start + pageSize;
        const result = this.customer.slice(start, end);
        return of(result).pipe(delay(500));
    }

    getTotalCount(): number {
        return this.customer.length;
    }

    checkDuplicateCode(code: string): boolean {
        return this.customer.some(c => c.customerCode.toLowerCase() === code.toLowerCase());
    }

    // thêm mới khách hàng 
    addCustomer(customerData: any): void {
        const newId = this.customer.length > 0
            ? Math.max(...this.customer.map(c => c.id)) + 1 : 1;

        const newCustomer: Customer = {
            id: newId,
            ...customerData
        };
        this.customer = [newCustomer, ...this.customer];
    }

    updateCustomer(id: number, updatedData: any): void {
        const index = this.customer.findIndex(c => c.id === id);
        if (index !== -1) {
            this.customer[index] = { id, ...updatedData };
        }
    }

    deleteCustomer(id: number): void {
        this.customer = this.customer.filter(c => c.id !== id);
    }
}