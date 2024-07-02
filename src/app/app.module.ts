import { NgModule, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { environment } from 'src/environments/environment.prod';

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UrlshortenerComponent } from './shared/urlshortener/urlshortener.component';
import { BookmarkComponent } from './shared/bookmark/bookmark.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { UrlFormComponent } from './shared/url-form/url-form.component';
import { GoogleSigninBtnComponent } from './shared/google-signin-btn/google-signin-btn.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { ResetPasswordComponent } from './shared/reset-password/reset-password.component';
import { ShareUrlComponent } from './shared/share-url/share-url.component';
import { QrCodeComponent } from './shared/qr-code/qr-code.component';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    UrlshortenerComponent,
    BookmarkComponent,
    UrlFormComponent,
    GoogleSigninBtnComponent,
    SpinnerComponent,
    ResetPasswordComponent,
    ShareUrlComponent,
    QrCodeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    FormsModule,
    BrowserAnimationsModule,
    ClipboardModule,
    ReactiveFormsModule,
    QRCodeModule,
    ToastrModule.forRoot()
  ],
  providers: [
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
      provideFirestore(() => getFirestore()),
      provideStorage(() => getStorage()),
      provideAuth(() => getAuth())
    )],
  bootstrap: [AppComponent]
})
export class AppModule { }
