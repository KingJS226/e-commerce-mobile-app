import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController
} from "ionic-angular";
import { CheckoutService } from "./checkout-confirm.service";

@IonicPage()
@Component({
  selector: "page-checkout-confirm",
  templateUrl: "checkout-confirm.html",
  providers: [CheckoutService]
})
export class CheckoutConfirmPage {
  itemsInCart: any[];
  orderData: any = {
    shippingDetails: {}
  };
  selectedAddress: any = {};
  currency;
  langJSON;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public checkoutService: CheckoutService,
    public loadingCtrl: LoadingController
  ) {
    this.itemsInCart = JSON.parse(localStorage.getItem("cart"));
    this.orderData = this.navParams.get("orderData");
    this.selectedAddress = this.navParams.get("selectedAddress");
  }

  ionViewWillEnter() {
    this.currency = localStorage.getItem('currency');
    this.checkoutService.getLangJson().subscribe((res: any) => {
      this.langJSON = res;
      // get user's address which was selected by user in cartPage.
      let loader = this.loadingCtrl.create({
        content: this.langJSON.please_wait ? this.langJSON.please_wait : 'Please Wait...'
      });
      loader.present();
      this.checkoutService.getAddressDetails(this.selectedAddress._id).subscribe(
        (address: any) => {
          this.orderData.shippingDetails = address;
          loader.dismiss();
        },
        error => {
          loader.dismiss();
        }
      );
    });
  }

  cart() {
    this.navCtrl.push("CartPage");
  }

  // navigate to AddressPage where user can update the selected address.
  updateAddress() {
    this.navCtrl.push("AddressPage", {
      selectedAddress: this.selectedAddress,
      orderData: this.orderData
    });
  }

  // if everything is fine then further navigate to payment page.
  placeOrder() {
    this.navCtrl.push("CheckoutPaymentPage", {
      orderData: this.orderData
    });
  }
}
