import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import { UrlData } from 'src/app/models/urlData';
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

  constructor(private formBuilder: FormBuilder, private utils: UtilsService) { }

  ngOnInit(): void {
    this.urlForm = this.formBuilder.group({
      long_url: [null, [Validators.required, Validators.pattern(this.utils.getUrlRegexPattern())]],
      short_url: [{value: null, disabled: true}],
      active: [true, Validators.required],
      email: [{value: null, disabled: true}],
      notes: [null],
      expire_at_datetime: [null]
    });
    this.patchFormData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['urlData'] && changes['urlData'].currentValue) || (changes['action'] && changes['action'].currentValue)) {
      this.patchFormData();
    }
  }

  patchFormData() {
    if (this.action === 'Edit' && this.urlData) {
      this.urlForm.patchValue({
        long_url: this.urlData.long_url,
        short_url: this.urlData.short_url,
        active: this.urlData.active,
        email: this.urlData.email,
        notes: this.urlData.notes,
        expire_at_datetime: this.utils.convertTimestampToLocalDateTime(this.urlData.expire_at_datetime)
      });
    } else {
      console.log("form reset in popup")
      this.urlForm.reset();
    }
  }

  onSubmit(): void {
    if (this.urlForm.valid) {
      console.log(this.urlForm.getRawValue());
      // Handle form submission
      this.close.emit();
    }
  }

  onExit() {
    this.close.emit();
  }

}
