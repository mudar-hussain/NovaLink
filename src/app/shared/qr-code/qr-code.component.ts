import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { QRCodeComponent } from 'angularx-qrcode';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.css']
})
export class QrCodeComponent {

  @Input() qrCodeValue: string = '';
  @ViewChild('qrcode', { static: false }) qrcode!: QRCodeComponent;

  qrCodeImage!: string;
  selectedFormat: string = '#';
  elementType: 'canvas' | 'svg' = 'canvas';

  constructor() {}

  generateQRCode() {
    if (this.qrCodeValue) {
      QRCode.toDataURL(this.qrCodeValue, (err, url) => {
        if (err) {
          console.error(err);
          return;
        }
        this.qrCodeImage = url;
      });
    }
  }

  downloadQRCode() {
    let imageToBeDownloaded = this.qrcode.qrcElement.nativeElement.firstChild.src;
    let format = this.selectedFormat;
    let linkElement = document.createElement('a');
    linkElement.href = imageToBeDownloaded;
    linkElement.download = `qrcode.${format}`;
    linkElement.click();
  }
}
