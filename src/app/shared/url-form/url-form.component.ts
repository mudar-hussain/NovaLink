import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import { UrlData } from 'src/app/models/urlData';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { UrlService } from 'src/app/services/url.service';
import { UtilsService } from 'src/app/services/utils.service';

declare var $: any;

@Component({
  selector: 'app-url-form',
  templateUrl: './url-form.component.html',
  styleUrls: ['./url-form.component.css']
})
export class UrlFormComponent implements OnInit, OnChanges {
  urlForm!: FormGroup;
  @Input() action: string = 'Bookmark';
  @Input() urlData: UrlData | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() shortenedUrlData = new EventEmitter<UrlData>();
  @Output() updateUrlData = new EventEmitter<any>();

  constructor(private formBuilder: FormBuilder, 
    private utils: UtilsService, 
    private configService: ConfigService,
    protected authService: AuthService) { }

  ngOnInit(): void {
    this.urlForm = this.formBuilder.group({
      long_url: [null, [Validators.required, Validators.pattern(this.utils.getUrlRegexPattern())]],
      active: [null, Validators.required],
      notes: [null],
      expire_at_datetime: [null]
    });
    this.patchFormData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (((changes['urlData'] && changes['urlData'].currentValue) || (changes['action'] && changes['action'].currentValue))) {
      this.patchFormData();
    }
  }

  patchFormData() {
    if (!this.urlForm) return;
    this.urlForm.reset();
    if (this.action == 'Edit' && this.urlData) {
      this.urlForm.patchValue({
        long_url: this.urlData.long_url,
        active: this.urlData.active,
        notes: this.urlData.notes,
        expire_at_datetime: this.utils.convertTimestampToLocalDateTime(this.urlData.expire_at_datetime)
      });
    }
  }

  onSubmit(): void {
    if (this.urlForm.valid) {
      const urlData: any = this.mapToUrlData(this.urlForm.getRawValue());
      this.utils.closeUrlFormModal();
      if(this.action == 'Shorten') {
        this.shortenedUrlData.emit(urlData);
      } else {
        this.updateUrlData.emit(urlData);
      }
      this.urlData = null;
      this.urlForm.reset();
      this.utils.closeUrlFormModal();
    }

  }

  mapToUrlData(urlData: any): any {
    if (this.action == 'Shorten') {
      return {
        long_url: urlData.long_url,
        short_id: null,
        short_url: this.configService.getDomainUrl(),
        active: urlData.active,
        email: this.authService.UserData?.email,
        notes: urlData.notes,
        expire_at_datetime: urlData.expire_at_datetime,
        created_at: Timestamp.fromDate(new Date()),
        updated_at: Timestamp.fromDate(new Date()),
        id: null
      } as UrlData;
    } else {
      return {
        long_url: urlData.long_url,
        active: urlData.active,
        notes: urlData.notes,
        expire_at_datetime: urlData.expire_at_datetime,
        updated_at: Timestamp.fromDate(new Date()),
        id: this.urlData?.id
      };
    }
    
  }

  onExit() {
    this.urlData = null;
    this.urlForm.reset();
    this.close.emit();
  }

}
