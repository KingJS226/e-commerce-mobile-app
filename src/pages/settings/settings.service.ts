import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ConstService } from "../../app/constService";

@Injectable()
export class SettingService {
  constructor(private http: HttpClient, public constService: ConstService) { }

  getUserInfo() {
    let authtoken = localStorage.getItem("token");
    const headers = new HttpHeaders().set("Authorization", authtoken);
    return this.http.get(this.constService.url + "api/users/me", {
      headers: headers
    });
  }

  updateUserInfo(userId, userInfo) {
    let body = userInfo;
    let authtoken = localStorage.getItem("token");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authtoken);
    return this.http.put(this.constService.url + "api/users/" + userId, body, {
      headers: headers
    });
  }

  getLangJson() {
    const langName = (localStorage.getItem('language') != null) ? localStorage.getItem('language') : 'en';
    return this.http.get('assets/i18n/' + langName + '.json');
  }
}
