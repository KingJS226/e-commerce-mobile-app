import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstService } from "../../app/constService";

@Injectable()
export class RatingService {
  constructor(private http: HttpClient, public constService: ConstService) { }

  submitReview(body) {
    let authtoken = localStorage.getItem("token");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authtoken);
    return this.http.post(this.constService.url + "api/productRatings", body, {
      headers: headers
    });
  }

  getLangJson() {
    const langName = (localStorage.getItem('language') != null) ? localStorage.getItem('language') : 'en';
    return this.http.get('assets/i18n/' + langName + '.json');
  }
}
