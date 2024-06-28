import { Injectable } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { AbstractControl, NgModel, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private spinnerVisibilitySubject = new Subject<boolean>();
  spinnerVisibility$ = this.spinnerVisibilitySubject.asObservable();
  urlPattern = /^(https?:\/\/)?((([a-zA-Z0-9$_.+!*'(),;?&=-]|%[0-9a-fA-F]{2})+(:([a-zA-Z0-9$_.+!*'(),;?&=-]|%[0-9a-fA-F]{2})+)?@)?((([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)|(\d{1,3}\.){3}\d{1,3}|(\[IPv6:[0-9a-fA-F:]+\]))(:\d+)?)(\/([a-zA-Z0-9$_.+!*'(),;:@&=/-]|%[0-9a-fA-F]{2})*)?(\?([a-zA-Z0-9$_.+!*'(),;:@&=/-]|%[0-9a-fA-F]{2})*)?(#([a-zA-Z0-9$_.+!*'(),;:@&=/-]|%[0-9a-fA-F]{2})*)?)$/;
  
  constructor(private clipboard: Clipboard) { }

  copyToClipboard(text: string): boolean {
    return this.clipboard.copy(text);
  }

  getUrlRegexPattern(): RegExp {
    return this.urlPattern;
  }

  convertToLocaleDateTime(timestamp: Timestamp | null): string {
    return timestamp ? timestamp.toDate().toLocaleString() : "";
  }  
  
  convertTimestampToLocalDateTime(timestamp: Timestamp | null): string {
    if (!timestamp) {
      return '';
    }
    const date = timestamp.toDate();
    return this.formatDateToLocalDateTime(date);
  }

  formatDateToLocalDateTime(date: Date): string {
    // Ensure consistent date and time formatting
    const year = date.getFullYear();
    const month = this.padNumber(date.getMonth() + 1); // Months are zero indexed
    const day = this.padNumber(date.getDate());
    const hours = this.padNumber(date.getHours());
    const minutes = this.padNumber(date.getMinutes());
    const seconds = this.padNumber(date.getSeconds());
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  
  padNumber(num: number): string {
    return num.toString().padStart(2, '0');
  }

  openSpinner() {
    this.spinnerVisibilitySubject.next(true);
  }

  closeSpinner() {
    this.spinnerVisibilitySubject.next(false);
  }
}
