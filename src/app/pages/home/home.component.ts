import { Component, NgZone, OnInit } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import { ToastrService } from 'ngx-toastr';
import { UrlData } from 'src/app/models/urlData';
import { ConfigService } from 'src/app/services/config.service';
import { UrlService } from 'src/app/services/url.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  url: string = '';
  shortenedUrls: Array<UrlData> = [];
  urlData!: UrlData;
  domainUrl: string = "";
  urlReg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  constructor(private urlService: UrlService,
    private toastr: ToastrService,
    private configService: ConfigService,
  private utils: UtilsService) {
    this.domainUrl = this.configService.getDomainUrl();
  }

  ngOnInit(): void {
    
  }

  shortenedUrlData(long_url: string) {
    this.urlData = {
      long_url: long_url,
      short_id: null,
      short_url: this.domainUrl,
      active: false,
      email: null,
      description: null,
      expire_at_datetime: null,
      expire_at_views: null,
      created_at: Timestamp.fromDate(new Date()),
      updated_at: Timestamp.fromDate(new Date()),
      id: null
    }
    this.generateShortUrl(this.urlData);
  }

  generateShortUrl(urlData: UrlData) {
    this.urlService.generateShortUrl(urlData)
      .then((data) => {
        this.shortenedUrls.push(data);
        this.copyToClipboard("Short Link Created", data.short_url);
      })
      .catch((err) => {
        console.error('Error generating short URL:', err);
      });
  }

  copyToClipboard(title: string, short_url: string) {
    if(this.utils.copyToClipboard(short_url)){
      this.toastr.success(short_url + ' has been copied to your clipboard', title);
    } else {
      this.toastr.success('Your short link is ready: ' + short_url, title);
    }
  }
}
