import { Component, OnInit } from '@angular/core';
import { Timestamp } from 'firebase/firestore';
import { UrlData } from 'src/app/models/urlData';
import { Auth } from 'src/app/models/auth.enum';
import { ConfigService } from 'src/app/services/config.service';
import { UrlService } from 'src/app/services/url.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AuthService } from 'src/app/services/auth.service';
import { take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  url: string = '';
  shortenedUrlList: Array<UrlData> = [];
  urlData!: UrlData;
  domainUrl: string = '';
  action: string = Auth.login;

  constructor(
    protected urlService: UrlService,
    private configService: ConfigService,
    protected utils: UtilsService,
    protected authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.domainUrl = this.configService.getDomainUrl();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      const id = params['id'];
      if (id) {
        this.handleRedirect(id);
      }
    });
    const storedList = localStorage.getItem('shortenedUrlList');
    if (storedList) {
      this.shortenedUrlList = JSON.parse(storedList, this.dateReviver);
    } else {
      this.shortenedUrlList = [];
    }
  }

  handleRedirect(id: string): void {
    this.urlService
      .getUrlByShortId(id)
      .pipe(take(1))
      .subscribe((data: UrlData[]) => {
        const urlData = data.length > 0 ? data[0] : null;
        if (urlData && urlData.long_url) {
          if (this.urlService.isUrlActive(urlData)) {
            let longUrl = urlData.long_url;

            // Check if the URL is absolute
            if (!/^https?:\/\//i.test(longUrl)) {
              longUrl = 'https://' + longUrl; // or use 'https://' if your URLs are HTTPS
            }
            window.open(longUrl, '_blank');
          }

          // Redirect current tab to home page
          this.router.navigate(['/']);
        } else {
          // Handle case where ID is not found or invalid
          this.router.navigate(['/']);
        }
      });
  }

  

  shortenedUrlData(long_url: string) {
    this.urlData = {
      long_url: long_url,
      short_id: null,
      short_url: this.domainUrl,
      active: true,
      email: null,
      notes: null,
      expire_at_datetime: this.utils.get24HoursFromNow(),
      created_at: Timestamp.fromDate(new Date()),
      updated_at: Timestamp.fromDate(new Date()),
      id: null,
    };
    this.generateShortUrl(this.urlData);
  }

  generateShortUrl(urlData: UrlData) {
    this.utils.openSpinner();
    this.urlService
      .generateShortUrl(urlData)
      .then((data) => {
        this.shortenedUrlList.push(data);
        localStorage.setItem('shortenedUrlList', JSON.stringify(this.shortenedUrlList));
        this.copyUrlToClipboard('Short Link Created', data.short_url);
      })
      .catch((err) => {
        console.error('Error generating short URL:', err);
      })
      .finally(() => this.utils.closeSpinner());
  }

  copyUrlToClipboard(title: string, short_url: string) {
    if (this.utils.copyToClipboard(short_url)) {
      this.utils.toastSuccess(
        title,
        short_url + ' has been copied to your clipboard'
      );
    } else {
      this.utils.toastSuccess(title, 'Your short link is ready: ' + short_url);
    }
  }

  deleteUrl(urlData: UrlData) {
    if (urlData.id != null) {
      this.urlService
        .deleteUrl(urlData.id)
        .then(() => {
          this.shortenedUrlList = this.shortenedUrlList.filter(
            (item) => item.short_url !== urlData.short_url
          );
          localStorage.setItem('shortenedUrlList', JSON.stringify(this.shortenedUrlList));
          this.utils.toastError(
            'Short Link Deleted',
            urlData.short_url + ' is deleted successfully'
          );
        })
        .catch((e) => this.utils.toastError('Error', e));
    } else {
      this.shortenedUrlList = this.shortenedUrlList.filter(
        (item) => item.short_url !== urlData.short_url
      );
      this.utils.toastError(
        'Short Link Deleted',
        urlData.short_url + ' is deleted successfully'
      );
    }
  }

  // Define the reviver function
dateReviver(key: string, value: any): any {
  if (key == 'expire_at_datetime') {
    // Handle the case where the value might be an object with toDate method
    if (typeof value === 'object' && value !== null && typeof value.toDate === 'function') {
      return value.toDate();
    }
    if (value && typeof value.seconds === 'number' && typeof value.nanoseconds === 'number') {
      return new Date(value.seconds * 1000 + value.nanoseconds / 1e6);
    }
  }
  return value;
}

}
