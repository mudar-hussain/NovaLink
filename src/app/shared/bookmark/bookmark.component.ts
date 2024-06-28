import { Component, OnInit } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import { ToastrService } from 'ngx-toastr';
import { UrlData } from 'src/app/models/urlData';
import { ConfigService } from 'src/app/services/config.service';
import { UrlService } from 'src/app/services/url.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.css']
})
export class BookmarkComponent implements OnInit{
  urlList: Array<UrlData> = [];
  domainUrl: string = "";
  action: string = "Shorten";
  urlData: UrlData | null = null;

  constructor(private urlService: UrlService,
    private toastr: ToastrService,
  protected utils: UtilsService,
private configService: ConfigService) {
    this.domainUrl = this.configService.getDomainUrl();
  }

  ngOnInit(): void {
    
    this.urlList.push({
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
    this.urlList.push({
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
    this.urlList.push({
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
    const urlData = {
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
    this.generateShortUrl(urlData);
  }
  
  openModal(action: string, urlData: UrlData | null) {
    this.action = action;
    this.urlData = urlData;
  }

  closeModal() {
    this.action = "Shorten";
    this.urlData = null;
  }

  generateShortUrl(urlData: UrlData) {
    this.urlService.generateShortUrl(urlData)
      .then((data) => {
        this.urlList.push(data);
        this.copyUrlToClipboard("Short Link Created", data.short_url);
      })
      .catch((err) => {
        console.error('Error generating short URL:', err);
      });
  }

  shareUrl(urlData: UrlData) {
    
  }

  editUrl(urlData: UrlData) {
    this.openModal('Edit', urlData);
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
      this.urlList = this.urlList.filter(item => item.short_url !== urlData.short_url);
      this.toastr.error(urlData.short_url + ' is deleted successfully', 'Short Link Deleted');
    }).catch((e) => console.log(e));
    } else {
      this.urlList = this.urlList.filter(item => item.short_url !== urlData.short_url);
      this.toastr.error(urlData.short_url + ' is deleted successfully', 'Short Link Deleted');
    }
    console.log(this.urlList);
  }

  onSubmit() {
    this.closeModal();
  }
}
