import { Component, OnInit } from '@angular/core';
import { UrlData } from 'src/app/models/urlData';
import { AuthErrorService } from 'src/app/services/auth-error.service';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { UrlService } from 'src/app/services/url.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.css'],
})
export class BookmarkComponent implements OnInit {
  urlList: Array<UrlData> = [];
  domainUrl: string = '';
  action: string = 'Shorten';
  urlData: UrlData | null = null;

  constructor(
    protected urlService: UrlService,
    protected utils: UtilsService,
    private configService: ConfigService,
    private authErrorService: AuthErrorService,
    private authService: AuthService
  ) {
    this.domainUrl = this.configService.getDomainUrl();
    this.updateUrlList();
  }

  ngOnInit(): void {
    // Subscribe to user data changes
    this.authService.getUserData().subscribe(userData => {
      if (userData) {
        this.updateUrlList();
      }
    });
  }

  shortenedUrlData(urlData: UrlData) {
    this.utils.closeUrlFormModal();
    this.generateShortUrl(urlData);
  }

  updateUrlData(urlData: any) {
    if(!urlData.id) {
      this.utils.toastError('Error', 'ID is null');
      return;
    }
    this.utils.closeUrlFormModal();
    this.utils.openSpinner();
    this.urlService
      .updateUrl(urlData.id, urlData)
      .then(() => {
        this.updateUrlList();
        this.utils.closeSpinner();
        this.utils.toastSuccess(
          'Link updated',
          'Link data updated successfully!'
        );
      })
      .catch((error) =>
        this.utils.toastWarning(
          null,
          this.authErrorService.getErrorMessage(error.code)
        )
      )
      .finally(() => this.utils.closeSpinner());
  }

  openModal(action: string, urlData: UrlData | null) {
    this.action = action;
    this.urlData = urlData;
  }

  closeModal() {
    this.action = 'Shorten';
    this.urlData = null;
  }

  generateShortUrl(urlData: UrlData) {
    this.utils.openSpinner();
    this.urlService
      .generateShortUrl(urlData)
      .then((data) => {
        this.copyUrlToClipboard('Short Link Created', data.short_url);
        this.updateUrlList();
      })
      .catch((err) => {
        console.error('Error generating short URL:', err);
      })
      .finally(() => this.utils.closeSpinner());
  }

  shareUrl(urlData: UrlData) {
    this.openModal('Shorten', urlData);
  }

  editUrl(urlData: UrlData) {
    this.openModal('Edit', urlData);
  }

  generateQrCode(urlData: UrlData) {
    this.openModal('Shorten', urlData);
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
    this.utils.openSpinner();
    if (urlData.id) {
      this.urlService
        .deleteUrl(urlData.id)
        .then(() => {
          this.urlList = this.urlList.filter(
            (item) => item.short_url !== urlData.short_url
          );
          this.utils.toastError(
            'Short Link Deleted',
            urlData.short_url + ' is deleted successfully'
          );
        })
        .catch((e) => this.utils.toastError('Error', this.utils.getErrorMessage(e)))
        .finally(() => this.utils.closeSpinner());
    }
  }

  updateUrlList() {
    if (this.authService.UserData?.email) {
      this.urlService
        .getAllUrlByEmail(this.authService.UserData?.email)
        .subscribe((userDataList) => {
          this.urlList = userDataList;
        });
    }
  }
}
