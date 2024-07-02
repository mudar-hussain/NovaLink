import { Component, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import { UrlData } from 'src/app/models/urlData';
import { ConfigService } from 'src/app/services/config.service';
import { UrlService } from 'src/app/services/url.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-share-url',
  templateUrl: './share-url.component.html',
  styleUrls: ['./share-url.component.css']
})
export class ShareUrlComponent {

  @Input() urlData!: UrlData | null;

  constructor(protected urlService: UrlService, private config: ConfigService, private utils:UtilsService) {
  }

  onSubmit(form: NgForm) {
    if(form.valid && this.urlData && form.value.email == this.urlData.email) {
      this.utils.toastError('Not Shared', 'You cannot share link with yourself.');
      return;
    }
    if(form.valid && this.urlData) {
      this.utils.openSpinner();
      const newUrlData = this.getNewUrlData(this.urlData, form.value.email);
      this.urlService.generateShortUrl(newUrlData)
      .then((urlData) => {
        this.utils.closeSpinner();
        this.utils.toastSuccess('Link Shared', 'Link successfully shared with ' + urlData?.email);
        this.utils.closeShareLinkModal();
      })
    } else {
      this.utils.toastError('Form Invalid','Something went wrong...');
    }
  }

  getNewUrlData(urlData: UrlData, email: string): UrlData {
    return {
      long_url: urlData.long_url,
      short_id: null,
      short_url: this.config.getDomainUrl(),
      active: false,
      email: email,
      notes: urlData.notes,
      expire_at_datetime: null,
      created_at: Timestamp.fromDate(new Date()),
      updated_at: Timestamp.fromDate(new Date()),
      id: null
    } as UrlData
  }
}
