import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Bai_2_ChangeInput-app';
   @ViewChild('inputBasic') inputElement!: ElementRef;
   ngAfterViewInit(){
     const input = fromEvent(this.inputElement.nativeElement, 'input');

    input.pipe(
      map((event: any) => event.target.value)
    ).subscribe({
      next: (val) => {
        console.log('Nội dung hiện tại:', val);
      },
      error: (error) => console.error("Xảy ra lỗi",error),
      complete:() => console.log("Đã hoàn thành")
     });
   }
}
