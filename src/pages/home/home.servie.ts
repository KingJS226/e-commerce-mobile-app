import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstService } from "../../app/constService";

@Injectable()
export class HomeService {
  constructor(private http: HttpClient, public constService: ConstService) { }

  //http request  for getting all categories
  getAllCategories() {
    const headers = new HttpHeaders();
    return this.http.get(this.constService.url + "api/categories", {
      headers: headers
    });
  }

  getAllBanners(){
    const headers = new HttpHeaders();
    return this.http.get(this.constService.url + "api/tags", {
      headers: headers
    });
  }

  getMenuitems() {
    const headers = new HttpHeaders();
    return this.http.get(
      this.constService.url + "api/categories/all/subcategory",
      {
        headers: headers
      }
    );
  }

  getFeaturedProducts(){
    const headers = new HttpHeaders();
    return this.http.get(this.constService.url + "api/products/featured/products",
    {headers: headers});
  }

  getFeaturedProducts2(){
    const headers = new HttpHeaders();
    return this.http.get(this.constService.url + "api/products/featured2/products",
    {headers: headers});
  }
  getFeaturedProducts3(){
    const headers = new HttpHeaders();
    return this.http.get(this.constService.url + "api/products/featured3/products",
    {headers: headers});
  }
  getFeaturedProducts4(){
    const headers = new HttpHeaders();
    return this.http.get(this.constService.url + "api/products/featured4/products",
    {headers: headers});
  }
  getFeaturedProducts5(){
    const headers = new HttpHeaders();
    return this.http.get(this.constService.url + "api/products/featured5/products",
    {headers: headers});
  }

  getLangJson() {
    const langName = (localStorage.getItem('language') != null) ? localStorage.getItem('language') : 'en';
    return this.http.get('assets/i18n/' + langName + '.json');
  }
}
