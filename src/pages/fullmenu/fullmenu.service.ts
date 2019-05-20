import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstService } from "../../app/constService";

@Injectable()
export class FullMenuService {
  constructor(private http: HttpClient, public constService: ConstService) { }



  getLangJson() {
    const langName = (localStorage.getItem('language') != null) ? localStorage.getItem('language') : 'en';
    return this.http.get('assets/i18n/' + langName + '.json');
  }

}
