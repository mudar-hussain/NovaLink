import { Injectable } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { AbstractControl, NgModel, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private clipboard: Clipboard) { }

  copyToClipboard(text: string): boolean {
    return this.clipboard.copy(text);
  }
}
