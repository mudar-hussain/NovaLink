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
  urlPattern = /^(https?:\/\/)?((([a-zA-Z0-9$_.+!*'(),;?&=-]|%[0-9a-fA-F]{2})+(:([a-zA-Z0-9$_.+!*'(),;?&=-]|%[0-9a-fA-F]{2})+)?@)?((([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)|(\d{1,3}\.){3}\d{1,3}|(\[IPv6:[0-9a-fA-F:]+\]))(:\d+)?)(\/([a-zA-Z0-9$_.+!*'(),;:@&=/-]|%[0-9a-fA-F]{2})*)?(\?([a-zA-Z0-9$_.+!*'(),;:@&=/-]|%[0-9a-fA-F]{2})*)?(#([a-zA-Z0-9$_.+!*'(),;:@&=/-]|%[0-9a-fA-F]{2})*)?)$/;
      
  urlForm!: FormGroup;
  @Output() shortenedUrlData = new EventEmitter<string>();

  constructor(private utils: UtilsService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
  this.urlForm = this.formBuilder.group({
      url: ['', [Validators.required, Validators.pattern(this.urlPattern)]]
    });
    
  }

  get url() {
    return this.urlForm.get('url');
  }

  onSubmit() {
    console.log(this.urlForm)
    if(this.urlForm.valid) {
      this.shortenedUrlData.emit(this.urlForm.get('url')?.value);
    } else {
      console.log('URL Invalid');
    }
  }
}
