import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  AlertController
} from "ionic-angular";
import { AddressListService } from "./address-list.service";
import { SettingService } from "../settings/settings.service";

@IonicPage()
@Component({
  selector: "page-address-list",
  templateUrl: "address-list.html",
  providers: [AddressListService, SettingService]
})
export class AddressListPage {
  addressList: any[];
  grandTotal: number;
  orderData: any = {
    cartItems: [],
    shippingDetails: {}
  };
  showAddress: boolean = false;
  selectedAddress: any = {};
  header_data: any;
  public payTotal: number = 0;
  public amountDetails: any = {};
  public currency: string;
  private langJSON;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private addressListService: AddressListService,
    private userProvider: SettingService
  ) {
    this.orderData.grandTotal = this.navParams.get("grandTotal");
    this.payTotal = this.orderData.grandTotal;
    this.orderData.subTotal = this.navParams.get("subTotal");
    this.orderData.taxAmount = this.navParams.get("taxAmount");
    this.orderData.couponDiscountPercentage = this.navParams.get("discount");
    this.orderData.deductedAmountByCoupon = this.navParams.get("deductedPrice");
    this.orderData.cartItems = JSON.parse(localStorage.getItem("cart"));
    this.orderData.deliveryCharge = this.navParams.get("deliveryCharge");
    this.header_data = {
      ismenu: false,
      isHome: false,
      isCart: true,
      isSearch: false,
      title: "Delivery Options"
    };
  }
  ionViewWillEnter() {
    this.currency = localStorage.getItem('currency');
    this.addressListService.getLangJson().subscribe((res: any) => {
      this.langJSON = res;
      this.initialize();
      this.header_data = {
        ismenu: false,
        isHome: false,
        isCart: true,
        isSearch: false,
        title: this.langJSON.Delivery_options ? this.langJSON.Delivery_options : "Delivery Options"
      };
    });
  }

  initialize() {
    let loader = this.loadingCtrl.create({
      content: this.langJSON.please_wait ? this.langJSON.please_wait : 'Please Wait...'
    });
    loader.present();
    // get array of all addresses of a user.
    this.addressListService.getAddressList().subscribe(
      (response: any) => {
        this.addressList = response;
        console.log("address", response);
        loader.dismiss();
      },
      error => {
        loader.dismiss();
      }
    );

    this.orderData.status = "pending";
  }


  addAddress() {
    this.navCtrl.push("AddressPage", { grandTotal: this.orderData.grandTotal });
  }

  selectAddress(address) {
    this.selectedAddress = address;
  }

  checkOut() {
    if (this.selectedAddress.userName) {
      this.navCtrl.push("CheckoutConfirmPage", {
        orderData: this.orderData,
        selectedAddress: this.selectedAddress
      });
    } else {
      // if user did'nt select address let's show alert.
      this.showAlert();
    }
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      subTitle: this.langJSON.please_select_address ? this.langJSON.please_select_address : "Please select address",
      buttons: [this.langJSON.OK ? this.langJSON.OK : "OK"]
    });
    alert.present();
  }
}
