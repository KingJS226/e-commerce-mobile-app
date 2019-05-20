import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstService } from "../../app/constService";

@Injectable()
export class CartService {
  constructor(private http: HttpClient, public constService: ConstService) { }

  getCoupons() {
    const headers = new HttpHeaders();
    return this.http.get(this.constService.url + "api/coupons", {
      headers: headers
    });
  }

  getProductInfo(productId: string) {
    const headers = new HttpHeaders();
    return this.http.get(this.constService.url + "api/products/" + productId, {
      headers: headers
    });
  }

  getTax() {
    const headers = new HttpHeaders();
    return this.http.get(this.constService.url + "api/settings", {
      headers: headers
    });
  }

  getLangJson() {
    const langName = (localStorage.getItem('language') != null) ? localStorage.getItem('language') : 'en';
    return this.http.get('assets/i18n/' + langName + '.json');
  }
}
