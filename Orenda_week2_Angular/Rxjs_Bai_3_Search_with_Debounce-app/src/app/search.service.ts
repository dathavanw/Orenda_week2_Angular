import { Injectable } from '@angular/core';
import { of, Observable, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private allData = ['Angular', 'Angular Material', 'RxJS Basics', 'React JS', 'Vue JS'];

  constructor() { }

  mockSearchAPI(textSearch: string): Observable<string[]> {
    console.log(`Đang gọi api cho từ khoá: "${textSearch}"`);
    
    const filtered = this.allData.filter(item =>
      item.toLowerCase().includes(textSearch.toLowerCase())
    );
    
    return of(filtered).pipe(delay(1000));
  }
}