import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstService } from "../../app/constService";

@Injectable()
export class ProductService {
  constructor(private http: HttpClient, public constService: ConstService) { }

  getProducts(subCategoryId) {
    const headers = new HttpHeaders();
    return this.http.get(
      this.constService.url + "api/products/subcategories/" + subCategoryId,
      {
        headers: headers
      }
    );
  }

  getProductsByCategory(categoryId) {
    const headers = new HttpHeaders();
    return this.http.get(
      this.constService.url + "api/products/category/" + categoryId,
      {
        headers: headers
      }
    );
  }

  getProductsTag(tag) {
    const headers = new HttpHeaders();
    return this.http.get(
      this.constService.url + "api/products/tag/" + tag,
      {
        headers: headers
      }
    );
  }

  getLangJson() {
    const langName = (localStorage.getItem('language') != null) ? localStorage.getItem('language') : 'en';
    return this.http.get('assets/i18n/' + langName + '.json');
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

}
