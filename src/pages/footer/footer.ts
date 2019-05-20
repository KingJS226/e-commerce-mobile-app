import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-footer",
  templateUrl: "footer.html"
})
export class FooterPage {
  //registeredUser: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  // ngOnInit() {
  //     let token = localStorage.getItem('token');
  //     if (token == null) {
  //         this.registeredUser = false;
  //     }
  //     else {
  //         this.registeredUser = true;
  //     }
  // }

  home() {
    this.navCtrl.setRoot("HomePage");
  }

  cart() {
    this.navCtrl.push("CartPage");
  }

  fullmenu() {
    this.navCtrl.push("FullMenuPage");
  }

  wishlist() {
    this.navCtrl.push("WishlistPage");
  }

  settings() {
    this.navCtrl.push("SettingsPage");
  }
}
