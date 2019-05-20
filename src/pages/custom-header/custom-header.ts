import { Component, Input } from "@angular/core";
import {IonicPage, Events, NavController, NavParams, LoadingController} from "ionic-angular";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ConstService} from "../../app/constService";

@IonicPage()
@Component({
  selector: "custom-header",
  templateUrl: "custom-header.html"
})
export class CustomHeaderPage {
  header_data: any;
  cartItems: any[];
  noOfItems: number;
  private langJSON;
  searchBarVisible = true;
  keywords: string;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private http: HttpClient,
    public loadingCtrl: LoadingController,
    public constService: ConstService,
    public events: Events
  ) {
    // check the length of cartItems.
    this.cartItems = JSON.parse(localStorage.getItem("cart"));
    if (this.cartItems != null) {
      this.noOfItems = this.cartItems.length;
    }
  }

  ngOnInit() {
    /* always listen for changes in cart items,
        whenever no of items in cart is zero set the noOfItems to null.
        because it shows 0 on the top of cart icon */
    this.events.subscribe("cart_count", count => {
      this.noOfItems = count > 0 ? count : null;
    });

    this.getLangJson().subscribe((res: any) => {
      this.langJSON = res;
    });
  }

  @Input()
  /* this sets header_data according to what properties are being passed through specific component.
    it is responsible for what properties have to show in header component*/
  set header(header_data: any) {
    this.header_data = header_data;
  }

  get header() {
    return this.header_data;
  }

  searchToggle() {
    this.searchBarVisible = !this.searchBarVisible;
  }

  // navigate to cart page
  gotoCart() {
    this.navCtrl.push("CartPage");
  }

  // navigate to home page
  gotoHome() {
    this.navCtrl.setRoot("HomePage");
  }

  searchProducts() {
    let loader = this.loadingCtrl.create({
      content: this.langJSON.please_wait ? this.langJSON.please_wait : 'Please Wait...'
    });
    loader.present();
    const headers = new HttpHeaders();
    this.http.get(this.constService.url + "api/products/name/like/" + this.keywords, {
      headers: headers
    }).subscribe(res => {
      loader.dismiss();
      this.navCtrl.push("ProductGridViewPage", {products: res});
    }, error1 => {
      loader.dismiss();
      this.searchToggle();
    });
  }

  getLangJson() {
    const langName = (localStorage.getItem('language') != null) ? localStorage.getItem('language') : 'en';
    return this.http.get('assets/i18n/' + langName + '.json');
  }

}
