import { Injectable, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { ConfigData } from '../models/config';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ConfigService implements OnInit {
  configData: ConfigData = {
    newsletterUrl: environment.newsletterUrl,
    linkedinProfileUrl: environment.linkedinProfileUrl,
    githubProfileUrl: environment.githubProfileUrl,
    domainUrl: environment.domainUrl
  }

  constructor(private firestore: Firestore) { 
  }

  ngOnInit(): void {}

  getNewsletterURL() {
      return this.configData.newsletterUrl;
  }

  getLinkedinProfileURL() {
    return this.configData.linkedinProfileUrl;
  }

  getGithubProfileUrl() {
    return this.configData.githubProfileUrl;
  }

  getDomainUrl() {
    return this.configData.domainUrl;
  }
}
