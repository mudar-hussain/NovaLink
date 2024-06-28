import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgModel, ValidationErrors, Validators } from '@angular/forms';
import { UrlData } from 'src/app/models/urlData';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-urlshortener',
  templateUrl: './urlshortener.component.html',
  styleUrls: ['./urlshortener.component.css']
})
export class UrlshortenerComponent implements OnInit {
      
  urlForm!: FormGroup;
  @Output() shortenedUrlData = new EventEmitter<string>();

  constructor(private utils: UtilsService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
  this.urlForm = this.formBuilder.group({
      url: ['', [Validators.required, Validators.pattern(this.utils.getUrlRegexPattern())]]
    });
    
  }

  get url() {
    return this.urlForm.get('url');
  }

  onSubmit() {
    console.log(this.urlForm)
    if(this.urlForm.valid) {
      this.shortenedUrlData.emit(this.urlForm.get('url')?.value);
      this.urlForm.get('url')?.setValue(null);
      this.urlForm.markAsUntouched();
    } else {
      console.log('URL Invalid');
    }
  }
}
