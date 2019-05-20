import { Component } from "@angular/core";
import {
  IonicPage,
  Events,
  NavController,
  NavParams,
  ToastController
} from "ionic-angular";
import { CartService } from "./cart.service";


@IonicPage()
@Component({
  selector: "page-cart",
  templateUrl: "cart.html",
  providers: [CartService]
})
export class CartPage {
  itemsInCart: any[];
  subTotalPrice: number;
  grandTotal: number;
  header_data: any;
  coupons: any[];
  discount: number = 0;
  deductedPrice: number = 0;
  taxPercentage: number;
  taxAmount: number;
  langJSON;
  currency;
  taxName;
  noOfItems: number = 0;
  maxInventories: any[] = [];
  subTotalWithoutCouponApplied: number = 0;
  subTotalValue: number = 0;
  deliveryCharge: number = 0;
  chargeAmount: number = 0;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private toastCtrl: ToastController,
    private cartService: CartService
  ) {
    this.header_data = {
      ismenu: false,
      isHome: false,
      isCart: true,
      isSearch: false,
      title: this.langJSON ? this.langJSON.Cart : 'Cart'
    };
    this.itemsInCart = JSON.parse(localStorage.getItem("cart"));
    console.log("catttt", this.itemsInCart);
    this.cartService.getLangJson().subscribe((res: any) => {
      this.langJSON = res;
      this.header_data = {
        ismenu: false,
        isHome: false,
        isCart: true,
        isSearch: false,
        title: this.langJSON ? this.langJSON.Cart : 'Cart'
      };
    });
  }

  /**when cart page loads , get all available coupons and  applicable taxes.
   * store all coupons and taxes for further calculations
   */
  ionViewDidLoad() {
    if (this.itemsInCart != null) {
      this.cartService.getCoupons().subscribe((coupons: any) => {
        this.coupons = coupons;
        console.log("coupons", this.coupons);
      });
      this.cartService.getTax().subscribe((tax: any) => {
        console.log("tax", tax);
        this.taxPercentage = tax.taxValue ? tax.taxValue : 0;
        this.taxName = tax.taxName ? tax.taxName : '';
        this.subTotalValue = tax.subTotal ? tax.subTotal : 0;
        this.deliveryCharge = tax.deliveryCharge ? tax.deliveryCharge : 0;
        this.chargeAmount = this.deliveryCharge;
        this.calculatePrice();
      });
      this.itemsInCart.forEach(element => {
        console.log(element);
        this.cartService.getProductInfo(element._id).subscribe((res) => {
          if (res['size']) {
            let sizes = [];
            sizes = res['size'];
            sizes.forEach(ele => {
              if (ele.name == element.size) {
                console.log('inventory', ele.limitedInventory);
                this.maxInventories.push({
                  name: ele.name,
                  amount: ele.sizeInventory,
                  setInventory: res["limitedInventory"]
                });
              }
            });
          }
        })
      })
    }
  }

  ionViewWillEnter() {
    this.currency = localStorage.getItem('currency');
    if (localStorage.getItem('cart') != null) {
      this.noOfItems = JSON.parse(localStorage.getItem('cart')).length;
    }
  }

  // remove cart items from the cart
  deleteItem(data) {
    for (let i = 0; i <= this.itemsInCart.length - 1; i++) {
      if (this.itemsInCart[i]._id == data._id) {
        this.itemsInCart.splice(i, 1);
        this.calculatePrice();
        localStorage.setItem("cart", JSON.stringify(this.itemsInCart));
        this.itemsInCart = JSON.parse(localStorage.getItem("cart"));
        this.events.publish("cart_count", this.itemsInCart.length);
      }
    }
    this.applyCoupon();
  }

  // increase the quantity of item in cart.
  addQuantity(item) {
    console.log("addd item", item);
    this.maxInventories.forEach(element => {
      if (element.name == item.size) {
        if (element.setInventory) {
          if (element.amount == item.quantity) {
            this.showToaster(this.langJSON.cart_Quantity_limit_exceeded ? this.langJSON.cart_Quantity_limit_exceeded : "Quantity limit exceeded", 3000);
          }else {
            if (item.quantity < item.itemHave) {
              item.quantity = item.quantity + 1;
              for (let i = 0; i <= this.itemsInCart.length - 1; i++) {
                if (this.itemsInCart[i]._id == item._id) {
                  this.itemsInCart[i].quantity = item.quantity;
                  this.itemsInCart[i].itemTotalPrice =
                    item.quantity * this.itemsInCart[i].price;
                }
              }
              localStorage.setItem("cart", JSON.stringify(this.itemsInCart));
              this.calculatePrice();
              this.applyCoupon();
            } else {
              this.showToaster(this.langJSON.cart_Quantity_limit_exceeded ? this.langJSON.cart_Quantity_limit_exceeded : "Quantity limit exceeded", 3000);
            }
          }
        } else {
          if (item.quantity < item.itemHave) {
            item.quantity = item.quantity + 1;
            for (let i = 0; i <= this.itemsInCart.length - 1; i++) {
              if (this.itemsInCart[i]._id == item._id) {
                this.itemsInCart[i].quantity = item.quantity;
                this.itemsInCart[i].itemTotalPrice =
                  item.quantity * this.itemsInCart[i].price;
              }
            }
            localStorage.setItem("cart", JSON.stringify(this.itemsInCart));
            this.calculatePrice();
            this.applyCoupon();
          } else {
            this.showToaster(this.langJSON.cart_Quantity_limit_exceeded ? this.langJSON.cart_Quantity_limit_exceeded : "Quantity limit exceeded", 3000);
          }
        }

      }
    });

  }

  // decrease the quantity of item in cart.
  removeQuantity(item) {
    if (item.quantity > 1) {
      item.quantity = item.quantity - 1;
      for (let i = 0; i <= this.itemsInCart.length - 1; i++) {
        if (this.itemsInCart[i]._id == item._id) {
          this.itemsInCart[i].quantity = item.quantity;
          this.itemsInCart[i].itemTotalPrice =
            item.quantity * this.itemsInCart[i].price;
        }
      }
      localStorage.setItem("cart", JSON.stringify(this.itemsInCart));
      this.calculatePrice();
      this.applyCoupon();
    }
  }

  // calculate the subtotal price and grandtotal price of all items in the cart.
  calculatePrice() {
    let proGrandTotalPrice = 0;
    for (let i = 0; i <= this.itemsInCart.length; i++) {
      if (this.itemsInCart[i] != null) {
        console.log("item carts", this.itemsInCart[i]);
        proGrandTotalPrice =
          proGrandTotalPrice + this.itemsInCart[i].itemTotalPrice;
      }
    }
    this.taxAmount = this.taxPercentage / 100 * proGrandTotalPrice;
    this.subTotalPrice = proGrandTotalPrice + this.taxAmount;
    if (this.subTotalValue<this.subTotalPrice){
      this.grandTotal = this.subTotalPrice;
      this.chargeAmount = 0;
    } else {
      this.grandTotal = this.subTotalPrice+this.deliveryCharge;
      this.chargeAmount = this.deliveryCharge;
    }
  }

  // subtracts discount amount from grandTotal price , if user select coupons
  applyCoupon() {
    console.log("coupon",this.discount);
    this.subTotalWithoutCouponApplied = this.subTotalPrice;
    let subTotals = this.subTotalPrice;
    this.deductedPrice = this.discount / 100 * subTotals;
    subTotals = subTotals - this.deductedPrice;
    if (this.subTotalValue<subTotals){
      this.grandTotal = subTotals;
      this.chargeAmount = 0;
    } else {
      this.grandTotal = subTotals+this.deliveryCharge;
      this.chargeAmount = this.deliveryCharge;
    }
  }

  removeAppliedCoupon() {
    this.subTotalPrice = this.subTotalWithoutCouponApplied;
    this.deductedPrice = 0;
    if (this.subTotalValue<this.subTotalPrice){
      this.grandTotal = this.subTotalPrice;
      this.chargeAmount = 0;
    } else {
      this.grandTotal = this.subTotalPrice+this.deliveryCharge;
      this.chargeAmount = this.deliveryCharge;
    }
    this.discount = null;
  }

  /*if user is logged-in navigate to further checkout
    otherwise navigate to log-in  page */
  navigateToAddressListPage() {
    if (localStorage.getItem("token")) {
      this.navCtrl.push("AddressListPage", {
        subTotal: this.subTotalPrice,
        taxAmount: this.taxAmount,
        discount: this.discount,
        deductedPrice: this.deductedPrice,
        grandTotal: this.grandTotal,
        deliveryCharge: this.chargeAmount
      });
    } else {
      this.navCtrl.push("LoginPage", {
        flag: 0
      });
    }
  }

  // check whether cart is empty or not.
  isCart(): boolean {
    return localStorage.getItem("cart") == null || this.itemsInCart.length == 0
      ? false
      : true;
  }

  // if cart is empty navigate to home page where user can add items in cart.
  home() {
    localStorage.removeItem("cart");
    this.navCtrl.push("HomePage");
  }

  private showToaster(message, duration) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration
    });
    toast.present();
  }
}
