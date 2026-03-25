import { Injectable } from '@angular/core';
import { of, Observable, delay, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostService {
  saveDraft(content: string): Observable<any> {
    console.log(`Đang gửi dữ liệu lên Server: "${content}"`);
    
    return of({ status: 'Success', time: new Date() }).pipe(
      delay(2000), 
      tap(() => console.log(`Đã lưu xong bản nháp: "${content}"`))
    );
  }
}