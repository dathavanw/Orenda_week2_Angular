import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, switchMap, tap } from 'rxjs';
import { PostService } from './post.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Bai_7_Auto-save-Form-app';

  postForm = new FormGroup({
    content: new FormControl('')
  });

  saveStatus = 'Chưa có thay đổi';
  isSaving = false;


  constructor(private postService: PostService) { }


  ngOnInit() {
    this.postForm.valueChanges.pipe(
      debounceTime(1000),
      tap(() => {
        this.isSaving = true;
        this.saveStatus = 'Đang tự động lưu...';
      }),
      switchMap(formValue => this.postService.saveDraft(formValue.content || ''))

    ).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.saveStatus = `Bản nháp đã được lưu lúc: ${res.time.toLocaleTimeString()}`;
      },
      error: (err) => {
        this.isSaving = false;
        this.saveStatus = 'Lỗi khi lưu bản nháp!';
      }
    });
  }
}