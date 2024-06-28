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
  shortenedUrlList: Array<UrlData> = [];
  urlData!: UrlData;
  domainUrl: string = "";
  urlReg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  constructor(private urlService: UrlService,
    private toastr: ToastrService,
    private configService: ConfigService,
  protected utils: UtilsService) {
    this.domainUrl = this.configService.getDomainUrl();
  }

  ngOnInit(): void {
    this.shortenedUrlList.push({
      long_url: "long_url",
      short_id: null,
      short_url: this.domainUrl+'1',
      active: false,
      email: null,
      notes: null,
      expire_at_datetime: Timestamp.fromDate(new Date(Date.now() + (1 * 60 * 1000))),
      created_at: Timestamp.fromDate(new Date()),
      updated_at: Timestamp.fromDate(new Date()),
      id: null
    } as UrlData);
    this.shortenedUrlList.push({
      long_url: "long_url",
      short_id: null,
      short_url: this.domainUrl+'2',
      active: false,
      email: null,
      notes: null,
      expire_at_datetime: Timestamp.fromDate(new Date(Date.now() + (2 * 60 * 1000))),
      created_at: Timestamp.fromDate(new Date()),
      updated_at: Timestamp.fromDate(new Date()),
      id: null
    } as UrlData);
    this.shortenedUrlList.push({
      long_url: "long_url",
      short_id: null,
      short_url: this.domainUrl+'3',
      active: false,
      email: null,
      notes: null,
      expire_at_datetime: Timestamp.fromDate(new Date(Date.now() + (3 * 60 * 1000))),
      created_at: Timestamp.fromDate(new Date()),
      updated_at: Timestamp.fromDate(new Date()),
      id: null
    } as UrlData);
  }

  shortenedUrlData(long_url: string) {
    const currentDate = new Date();
    currentDate.setTime(currentDate.getTime() + 10 * 60 * 1000);
    this.urlData = {
      long_url: long_url,
      short_id: null,
      short_url: this.domainUrl,
      active: false,
      email: null,
      notes: null,
      expire_at_datetime: Timestamp.fromDate(new Date(Date.now() + (10 * 60 * 1000))),
      created_at: Timestamp.fromDate(new Date()),
      updated_at: Timestamp.fromDate(new Date()),
      id: null
    }
    this.generateShortUrl(this.urlData);
  }

  generateShortUrl(urlData: UrlData) {
    this.urlService.generateShortUrl(urlData)
      .then((data) => {
        this.shortenedUrlList.push(data);
        this.copyUrlToClipboard("Short Link Created", data.short_url);
      })
      .catch((err) => {
        console.error('Error generating short URL:', err);
      });
  }

  shareUrl(urlData: UrlData) {

  }

  editUrl(urlData: UrlData) {

  }

  copyUrlToClipboard(title: string, short_url: string) {
    if(this.utils.copyToClipboard(short_url)){
      this.toastr.success(short_url + ' has been copied to your clipboard', title);
    } else {
      this.toastr.success('Your short link is ready: ' + short_url, title);
    }
  }

  deleteUrl(urlData: UrlData) {
    if (urlData.id != null) {
    this.urlService.deleteUrl(urlData.id).then(() => {
      this.shortenedUrlList = this.shortenedUrlList.filter(item => item.short_url !== urlData.short_url);
      this.toastr.error(urlData.short_url + ' is deleted successfully', 'Short Link Deleted');
    }).catch((e) => console.log(e));
    } else {
      this.shortenedUrlList = this.shortenedUrlList.filter(item => item.short_url !== urlData.short_url);
      this.toastr.error(urlData.short_url + ' is deleted successfully', 'Short Link Deleted');
    }
    console.log(this.shortenedUrlList);
  }
}
