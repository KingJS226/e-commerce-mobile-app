import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstService } from "../../app/constService";

@Injectable()
export class AddressService {
  constructor(private http: HttpClient, public constService: ConstService) { }

  addAddress(body) {
    let authtoken = localStorage.getItem("token");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authtoken);
    return this.http.post(this.constService.url + "api/addresses/", body, {
      headers: headers
    });
  }

  updateAddress(addressId, address) {
    const body = address;
    let authtoken = localStorage.getItem("token");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authtoken);
    return this.http.put(
      this.constService.url + "api/addresses/" + addressId + "/",
      body,
      {
        headers: headers
      }
    );
  }

  getAddressById(addressId) {
    let authtoken = localStorage.getItem("token");
    const headers = new HttpHeaders().set("Authorization", authtoken);
    return this.http.get(
      this.constService.url + "api/addresses/getaddress/" + addressId,
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
