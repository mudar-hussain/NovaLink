import { Injectable } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { Timestamp } from 'firebase/firestore';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AuthErrorService } from './auth-error.service';

declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private spinnerVisibilitySubject = new Subject<boolean>();
  spinnerVisibility$ = this.spinnerVisibilitySubject.asObservable();
  urlPattern: RegExp = /^(?:(?:https?|ftp):\/\/|^(?!.*(?:https?|ftp))).*(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/;

  
  constructor(private clipboard: Clipboard,
    private toastr: ToastrService,
  private authErrorService: AuthErrorService) { }

  copyToClipboard(text: string): boolean {
    return this.clipboard.copy(text);
  }

  getUrlRegexPattern(): RegExp {
    return this.urlPattern;
  }

  convertToLocaleDateTime(timestamp: Timestamp | Date | string | null | undefined): string {
    if (!timestamp) {
      return ""; // Handle case where timestamp is null or undefined
    }
  
    if (typeof timestamp === 'string') {
      const date = new Date(timestamp);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return ""; // Handle case where timestamp is an invalid date string
      }
      
      return date.toLocaleString();
    } else if (timestamp instanceof Date) {
      return timestamp.toLocaleString();
    } else if (timestamp instanceof Timestamp) {
      return timestamp.toDate().toLocaleString();
    } else {
      return "";
    }
  } 
  
  convertTimestampToLocalDateTime(timestamp: Timestamp | string | null | undefined): string | null {
    if (!timestamp) {
      return null;
    }
  
    let date: Date;
  
    if (typeof timestamp === 'string') {
      date = new Date(timestamp);
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp.toDate === 'function') {
      // Assuming it's a Timestamp object from a library like Firebase
      date = timestamp.toDate();
    } else {
      // If the type is unexpected, log a warning and return null
      console.warn("Unexpected type for timestamp:", typeof timestamp);
      return null;
    }
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

  get24HoursFromNow(): Timestamp {
    return Timestamp.fromDate(new Date(Date.now() + (24 * 60 * 60 * 1000)));
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

  closeLoginModal() {
    this.closeModal('authModal');
  }

  closeUrlFormModal() {
    this.closeModal('urlFormModal');
  }

  closeShareLinkModal() {
    this.closeModal('shareUrlModal');
  }

  closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      // Bootstrap's modal method to close modal
      $(modalElement).modal('hide');
      // Ensure the backdrop is removed after modal is hidden
      $(modalElement).on('hidden.bs.modal', function () {
        $('.modal-backdrop').remove();
      });
    }
  }

  toastSuccess(title: string | null, content: string) {
    if (title) {
      this.toastr.success(content, title);
    } else {
      this.toastr.success(content);
    }
  }

  toastWarning(title: string | null, content: string) {
    if (title) {
      this.toastr.warning(content, title);
    } else {
      this.toastr.warning(content);
    }
  }

  toastError(title: string | null, content: string) {
    if (title) {
      this.toastr.error(content, title);
    } else {
      this.toastr.error(content);
    }
  }

  getErrorMessage(errorCode: string): string {
    return this.authErrorService.getErrorMessage(errorCode);
  }

  truncateText(text: string | null, maxLength: number): string {
    if(!text) return '';
    if (text.length <= maxLength) {
      return text;
    }
    
    return text.slice(0, maxLength) + '...';
  }
}
