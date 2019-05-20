import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ToastController
} from "ionic-angular";
import { AddressService } from "./address.service";

@IonicPage()
@Component({
  selector: "page-address",
  templateUrl: "address.html",
  providers: [AddressService]
})
export class AddressPage {
  address = {
    userName: "",
    addressline: "",
    mobileNo: "",
    landmark: "",
    city: "",
    state: "",
    pincode: ""
  };
  addressId: "";
  orderData: any;
  selectedAddress: any;
  langJSON;
  zone: any;
  countries: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public addressService: AddressService,
    private toastCtrl: ToastController
  ) {
    this.orderData = this.navParams.get("orderData");
    this.addressService.getLangJson().subscribe((res: any) => {
      this.langJSON = res;
    });
  }

  //auto fill the address form when user wants to update existing address.
  ngOnInit() {
    this.zone = {
      kind: 'State'
    };
    this.address.state = 'State';
    this.countries = [
      {title: 'State'},
      {title: 'Andhra Pradesh'},
      {title: 'Arunachal Pradesh'},
      {title: 'Assam'},
      {title: 'Bihar'},
      {title: 'Goa'},
      {title: 'Gujarat'},
      {title: 'Haryana'},
      {title: 'Himachal Pradesh'},
      {title: 'Jammu and Kashmir'},
      {title: 'Jharkhand'},
      {title: 'Karnataka'},
      {title: 'Kerala'},
      {title: 'Madhya Pradesh'},
      {title: 'Maharashtra'},
      {title: 'Manipur'},
      {title: 'Meghalaya'},
      {title: 'Mizoram'},
      {title: 'Nagaland'},
      {title: 'Odisha'},
      {title: 'Punjab'},
      {title: 'Rajasthan'},
      {title: 'Sikkim'},
      {title: 'Tamil Nadu'},
      {title: 'Telangana'},
      {title: 'Tripura'},
      {title: 'Uttar Pradesh'},
      {title: 'Uttarakhand'},
      {title: 'West Bengal'}
    ];

    if (this.navParams.get("selectedAddress")) {
      this.selectedAddress = this.navParams.get("selectedAddress");
      if (this.selectedAddress._id) {
        this.addressService
          .getAddressById(this.selectedAddress._id)
          .subscribe((response: any) => {
            this.address.userName = response.userName;
            this.address.addressline = response.addressline;
            this.address.landmark = response.landmark;
            this.address.city = response.city;
            this.address.state = response.state;
            this.address.pincode = response.pincode;
            this.address.mobileNo = response.mobileNo;
          });
      }
    }
  }

  // either add a new address or update existing address of current user based on condition.
  public onSubmitAddress() {
    let loader = this.loadingCtrl.create({
      content: this.langJSON.please_wait ? this.langJSON.please_wait : 'Please Wait...'
    });
    loader.present();
    if (this.address.mobileNo && this.address.state !=="State") {
      console.log(this.address.mobileNo);
      if (this.address.mobileNo.length > 9 && this.address.mobileNo.length < 13) {
        console.log(this.address.mobileNo);

        if (this.navParams.get("selectedAddress")) {
          // update the existing address.
          this.addressService
            .updateAddress(this.selectedAddress._id, this.address)
            .subscribe(
              response => {
                loader.dismiss();
                this.navCtrl.push("CheckoutConfirmPage", {
                  selectedAddress: response,
                  orderData: this.orderData
                });
              },
              error => {
                loader.dismiss();
              }
            );
        } else {
          // add a new address
          this.addressService.addAddress(this.address).subscribe(
            response => {
              loader.dismiss();
              this.navCtrl.push("AddressListPage", {
                grandTotal: this.navParams.get("grandTotal")
              });
            },
            error => {
              loader.dismiss();
            }
          );
        }
      } else {
        this.toastCtrl.create({
          position: 'bottom',
          message: 'Invalid mobile number',
          duration: 3000
        }).present();
        loader.dismiss();
      }
    } else {
      loader.dismiss();
    }
  }

  public confirm() {
    this.navCtrl.push("CheckoutConfirmPage");
  }

  selecte(key:any){
    this.address.state = key;
  }

}
