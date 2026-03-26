import { Injectable } from '@angular/core';
import { Customer } from '../Model/customer.model';
import { BehaviorSubject, delay, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class CustomerService {

    /*
       Em giả lập 1 endpoint chứa danh sách khách hàng 
       Sử dụng thư viện json-server để chạy file db.json ạ 
       
       Cài đặt json-server:  npm install -g json-server@1.0.0-beta.15
       Chạy endpoint chứa dữ liệu: json-server --watch db.json --port 3000
    
    */

    private apiUrl = 'http://localhost:3000/customers';
    constructor(private http: HttpClient) { }

    loadDataFromServer(pageIndex: number, pageSize: number): Observable<any> {
        const url = `${this.apiUrl}?_page=${pageIndex}&_per_page=${pageSize}&_sort=-id`;
        return this.http.get<any>(url, { observe: 'response' });
    }

    checkDuplicateCode(code: string): Observable<Customer[]> {
        const url = `${this.apiUrl}?customerCode:eq=${code.trim()}`;
        return this.http.get<Customer[]>(url);
    }

    addCustomer(customerData: Customer): Observable<Customer> {
        return this.http.post<Customer>(this.apiUrl, customerData);
    }

    updateCustomer(id: any, updatedData: Customer): Observable<Customer> {
        return this.http.put<Customer>(`${this.apiUrl}/${id}`, updatedData);
    }

    deleteCustomer(id: any): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}