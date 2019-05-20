import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstService } from "../../app/constService";

@Injectable()
export class ProductService {
  constructor(private http: HttpClient, public constService: ConstService) { }

  getProduct(productId) {
    const headers = new HttpHeaders();
    return this.http.get(this.constService.url + "api/products/" + productId, {
      headers: headers
    });
  }

  getSizeGuide(subcategoryId){
    const headers = new HttpHeaders();
    return this.http.get(this.constService.url + "api/subcategories/" + subcategoryId, {
      headers: headers
    });
  }

  addToFavourite(productId) {
    let productInfo: any = {};
    productInfo.product = productId;
    let body = JSON.stringify(productInfo);
    let authtoken = localStorage.getItem("token");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authtoken);
    return this.http.post(this.constService.url + "api/favourites", body, {
      headers: headers
    });
  }

  removeToFavourite(productId) {
    let productInfo: any = {};
    productInfo.product = productId;
    let body = JSON.stringify(productInfo);
    let authtoken = localStorage.getItem("token");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authtoken);
    return this.http.post(
      this.constService.url + "api/favourites/delete/",
      body,
      {
        headers: headers
      }
    );
  }

  checkFavourite(productId) {
    let productInfo: any = {};
    productInfo.product = productId;
    let body = JSON.stringify(productInfo);
    let authtoken = localStorage.getItem("token");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authtoken);
    return this.http.post(
      this.constService.url + "api/favourites/check",
      body,
      {
        headers: headers
      }
    );
  }

  getLangJson() {
    const langName = (localStorage.getItem('language') != null) ? localStorage.getItem('language') : 'en';
    return this.http.get('assets/i18n/' + langName + '.json');
  }
}
