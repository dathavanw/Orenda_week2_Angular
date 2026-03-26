import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { InputService } from './Input.service';

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
   constructor(private inputService: InputService) {}
   
   ngAfterViewInit(){
     const input = this.inputService.formatInputStream(this.inputElement.nativeElement)
    input.subscribe({
      next: (val) => {
        console.log('Nội dung hiện tại:', val);
      },
      error: (error) => console.error("Xảy ra lỗi",error),
      complete:() => console.log("Đã hoàn thành")
     });
   }
}
