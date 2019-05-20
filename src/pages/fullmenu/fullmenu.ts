import {Component, ElementRef, Input, Renderer, ViewChild} from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController
} from "ionic-angular";
import { FullMenuService } from "./fullmenu.service";
import { SettingService } from "../settings/settings.service";

@IonicPage()
@Component({
  selector: "page-fullmenu",
  templateUrl: "fullmenu.html",
  providers: [FullMenuService, SettingService]
})
export class FullMenuPage {


  favourites: any[] = [];
  currency;
  langJSON;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public settingService: SettingService,
    public fullmenuService: FullMenuService,
    public renderer: Renderer
  ) {}

  ionViewWillEnter() {
    this.currency = localStorage.getItem('currency');
    this.fullmenuService.getLangJson().subscribe((res: any) => {
      this.langJSON = res;
    });
  }


  // get the array of items which have been added to wishlist.
  // check whether the user is logged in or not.
  isLoggedin(): boolean {
    return localStorage.getItem("token") ? true : false;
  }

  login() {
    this.navCtrl.push("LoginPage");
  }


}
