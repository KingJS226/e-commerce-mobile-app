import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstService } from "../../app/constService";

@Injectable()
export class CheckoutService {
  constructor(private http: HttpClient, public constService: ConstService) { }

  getAddressDetails(addressId) {
    let authtoken = localStorage.getItem("token");
    const headers = new HttpHeaders().set("Authorization", authtoken);
    return this.http.get(
      this.constService.url + "api/addresses/getaddress/" + addressId,
      {
        headers: headers
      }
    );
  }

  placeOrder(body) {
    let authtoken = localStorage.getItem("token");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authtoken);
    return this.http.post(this.constService.url + "api/orders", body, {
      headers: headers
    });
  }

  getLangJson() {
    const langName = (localStorage.getItem('language') != null) ? localStorage.getItem('language') : 'en';
    return this.http.get('assets/i18n/' + langName + '.json');
  }
}
