import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstService } from "../../app/constService";

@Injectable()
export class AddressListService {
  constructor(private http: HttpClient, public constService: ConstService) { }

  getAddressList() {
    let authtoken = localStorage.getItem("token");
    const headers = new HttpHeaders().set("Authorization", authtoken);
    return this.http.get(this.constService.url + "api/addresses/", {
      headers: headers
    });
  }

  deleteAddress(addressId) {
    let authtoken = localStorage.getItem("token");
    const headers = new HttpHeaders().set("Authorization", authtoken);
    return this.http.delete(
      this.constService.url + "api/addresses/" + addressId,
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
