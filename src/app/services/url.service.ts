import { Injectable } from '@angular/core';
import { Firestore, collectionData, deleteDoc } from '@angular/fire/firestore';
import { UrlData } from '../models/urlData';
import { DocumentData, DocumentReference, addDoc, collection, doc, getDoc, limit, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { Observable, map } from 'rxjs';
import { ConfigService } from './config.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  urlMapInstance = collection(this.firestore, 'url_map');
  domainUrl: string = "";

  constructor(private firestore: Firestore,
    private configService: ConfigService,
    private utils: UtilsService) {
    this.domainUrl = this.configService.getDomainUrl();
    this.urlMapInstance = collection(this.firestore, 'url_map');
  }

  generateShortUrl(urlData: UrlData): Promise<any> {
    return this.addUrl(urlData)
      .then((docRef) => {
        const shortId: string = docRef.id.slice(-5);
        urlData.short_id = shortId;
        urlData.short_url = `${this.domainUrl}${shortId}`;
        urlData.active = true;
        urlData.id = docRef.id;
        return this.updateUrl(docRef.id, urlData)
          .then(() => urlData)
          .catch((error) => {
            this.utils.toastError(null, this.utils.getErrorMessage(error));
            throw error; // Re-throw the error to propagate it up the chain
          });
      })
      .catch((error) => {
        this.utils.toastError(null, this.utils.getErrorMessage(error));
        throw error; // Re-throw the error to ensure it's handled by the caller
      });
  }


  shareShortUrl(id: string, email: string) {
    this.getUrlById(id)
    .then((urlData) => {
      if(urlData) {
        urlData.email = email;
        this.generateShortUrl(urlData)
        
      }
    })
  }

  getUrlByShortId(short_id: string): Observable<UrlData[]> {
    const urlMapQuery = query(
      this.urlMapInstance,
      where('short_id', '==', short_id),
      limit(1)
    );
    return this.mapCollectionDataToUrlDataList(
      collectionData(urlMapQuery, { idField: 'id' })
    );
  }

  getUrlById(id: string) {
    const urlIdInstance = doc(this.firestore, 'url_map', id);
    return getDoc(urlIdInstance)
      .then((docRef) => {
        if (docRef.exists()) {
          return this.mapToUrlData(docRef.data());
        } else return null;
      })
      .catch((err) => {
        this.utils.getErrorMessage(err.code);
      })
      .finally(() => {
        return null;
      });
  }

  addUrl(urlData: any): Promise<DocumentReference> {
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

  isUrlActive(url: any): boolean {
    if (url.expire_at_datetime !== null && url.expire_at_datetime !== undefined) {
      let expireDate: Date;
  
      if (typeof url.expire_at_datetime === 'string' || url.expire_at_datetime instanceof String) {
        expireDate = new Date(url.expire_at_datetime);
      } else if (url.expire_at_datetime instanceof Date) {
        expireDate = url.expire_at_datetime;
      } else if (typeof url.expire_at_datetime.toDate === 'function') {
        // Assuming it's a Timestamp object from a library like Firebase
        expireDate = url.expire_at_datetime.toDate();
      } else {
        // If the type is unexpected, log a warning and return the url's active status
        console.warn("Unexpected type for url.expire_at_datetime:", typeof url.expire_at_datetime);
        return url.active;
      }
      return url.active && expireDate.getTime() > Date.now();
    } else {
      return url.active;
    }
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
      created_at: urlData.created_at,
      updated_at: urlData.updated_at,
      id: urlData.id
    } as UrlData;
  }
}
