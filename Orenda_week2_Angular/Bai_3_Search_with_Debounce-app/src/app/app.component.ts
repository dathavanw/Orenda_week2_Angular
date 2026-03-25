import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { fromEvent, of } from 'rxjs';
import {
  map,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  delay,
  tap
} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {

  title = 'Bai_3_Search_with_Debounce-app';
  @ViewChild('searchInput') searchInput!: ElementRef;

  results: string[] = [];
  isSearching = false;

  // Mock API Search 
  mockSearchAPI(textSearch: string) {
    console.log(`Đang gọi api cho từ khoá: "${textSearch}"`);
    const allData = ['Angular', 'Angular Material', 'RxJS Basics', 'React JS', 'Vue JS'];
    const filtered = allData.filter(item =>
      item.toLowerCase().includes(textSearch.toLowerCase())
    );
    return of(filtered).pipe(delay(1000));
  }

  ngAfterViewInit() {
    fromEvent(this.searchInput.nativeElement, 'input').pipe(
      map((event: any) => event.target.value),
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => {
        this.isSearching = true;
        this.results = [];
      }),
      switchMap(term => {
        if (!term.trim()) {
          this.isSearching = false;
          return of([]); 
        }
        return this.mockSearchAPI(term);
      })
    ).subscribe(data => {
      this.results = data;
      this.isSearching = false;
      console.log('Đã nhận kết quả:', data);
    });
  }
}

