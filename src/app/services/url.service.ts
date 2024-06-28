import { Injectable } from '@angular/core';
import { Firestore, collectionData, deleteDoc } from '@angular/fire/firestore';
import { UrlData } from '../models/urlData';
import { DocumentData, addDoc, collection, doc, limit, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  urlMapInstance = collection(this.firestore, 'url_map');
  domainUrl: string = "";

  constructor(private firestore: Firestore,
    private configService: ConfigService,
    private router: Router) {
      this.domainUrl = this.configService.getDomainUrl();
     }

  generateShortUrl(urlData: any): Promise<any> {
    return this.addUrl(urlData).then((docRef) => {
      const shortId: string = docRef.id.slice(-5);
      urlData.short_id = shortId;
      urlData.short_url = this.domainUrl + shortId;
      urlData.active = true;
      urlData.id = docRef.id;
      return this.updateUrl(docRef.id, urlData)
      .then(() => urlData)
      .catch(err => {
        console.error('Error updating URL:', err);
        throw err; // Re-throw the error to be caught by the outer catch
      });
    })
    .catch(err => {
      console.error('Error adding URL:', err);
      throw err; // Re-throw the error to ensure promise rejection is handled correctly
    });
  }

  addUrl(urlData: any) {
    return addDoc(this.urlMapInstance, urlData);
  }

  updateUrl(id: string, urlData: any) {
    const urlUpdateInstance = doc(this.firestore, 'url_map', id);
    return updateDoc(urlUpdateInstance, urlData);
  }

  deleteUrl(id: string) {
    const urlDeleteInstance = doc(this.firestore, 'url_map', id);
    return deleteDoc(urlDeleteInstance);
  }

  getAllUrlByEmail(email: string): Observable<UrlData[]> {
    const urlMapQuery = query(
      this.urlMapInstance,
      where('email', '==', email),
      orderBy('active', 'desc'),
      orderBy('updated_at', 'desc')
    );
    return this.mapCollectionDataToUrlDataList(
      collectionData(urlMapQuery, { idField: 'id' })
    );
  }

  getUrlDataByShortId(short_id: string): Observable<UrlData[]> {
    const urlMapQuery = query(
      this.urlMapInstance,
      where('short_id', '==', short_id)
    );
    return this.mapCollectionDataToUrlDataList(
      collectionData(urlMapQuery, { idField: 'id' })
    );
  }

  mapCollectionDataToUrlDataList(
    obsUrlDataList: Observable<DocumentData[]>
  ): Observable<UrlData[]> {
    return obsUrlDataList.pipe(
      map((urlData: any[]) => {
        return urlData.map((url) => this.mapToUrlData(url));
      })
    );
  }

  mapToUrlData(urlData: any): UrlData {
    return {
      long_url: urlData.long_url,
      short_id: urlData.short_id,
      short_url: urlData.short_url,
      active: urlData.active,
      email: urlData.email,
      notes: urlData.notes,
      expire_at_datetime: urlData.expire_at_datetime,
      expire_at_views: urlData.expire_at_views,
      created_at: urlData.created_at,
      updated_at: urlData.updated_at,
      id: urlData.id
    } as UrlData;
  }
}
