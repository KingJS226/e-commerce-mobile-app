import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  AlertController,
  ToastController
} from "ionic-angular";
import { ProductService } from "./product.service";
import { FormGroup, FormControl } from "@angular/forms";
import { SocialSharing } from "@ionic-native/social-sharing";

@IonicPage()
@Component({
  selector: "page-product",
  templateUrl: "product.html",
  providers: [ProductService, SocialSharing]
})
export class ProductPage {
  like = false;
  productId: "";
  disable: boolean = false;
  public  productDetails: any = {};
  product: any = {};
  itemInCart: any[] = [];
  itemsInCart: any[] = [];
  header_data: any;
  title: "";
  thumbnails: any[] = [];
  sizes: any[] = [];
  discount: number;
  currency;
  langJSON;
  guideUrl: any = "";
  showGuide: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toasterCtrl: ToastController,
    public productService: ProductService,
    private socialSharing: SocialSharing
  ) {
    this.productId = this.navParams.get("productId");
    this.title = this.navParams.get("title");
    this.product.category = this.navParams.get("categoryId");
    this.header_data = {
      ismenu: false,
      isHome: false,
      isCart: true,
      isSearch: false,
      title: this.title
    };
  }
  ionViewWillEnter() {
    this.currency = localStorage.getItem('currency');
  }

  ngOnInit() {
    this.productService.getLangJson().subscribe((res: any) => {
      this.langJSON = res;
      let loader = this.loadingCtrl.create({
        content: this.langJSON.please_wait ? this.langJSON.please_wait : 'Please Wait...'
      });
      loader.present();
      this.productService.getProduct(this.productId).subscribe(
        (response: any) => {
          // store all details of product for adding it to cart .
          this.productDetails = response;
          if (response.limitedInventory){
            response.size.forEach(element => {
              if (element.sizeInventory > 0){
                console.log(element);
                this.sizes.push(element);
              }
            });
            this.productDetails.size = this.sizes;
            console.log(this.productDetails.size);
          } else {
            console.log(response.size);
            this.sizes = response.size;
            this.productDetails.size = this.sizes;
          }
          if (this.sizes.length < 1){
            this.disable = true;
          }
          if (this.productDetails.subCategoryId._id){
            this.productService.getSizeGuide(this.productDetails.subCategoryId._id).subscribe(
              (res: any) => {
                this.guideUrl = res.sizeGuideUrl;
              }
            )
          }
          console.log('product details', JSON.stringify(this.productDetails, undefined, 2));
          let tempColorArray = [];
          this.productDetails.sizeColors = tempColorArray;
          this.discount = Math.round((this.productDetails.dummyPrice-this.productDetails.price)*10000/this.productDetails.dummyPrice)/100;
          this.product._id = response._id;
          this.product.title = response.title;
          this.product.color = response.color;
          this.product.categoryName = response.categoryId.title;
          this.product.subCategoryName = response.subCategoryId.title;
          this.product.brandName = response.brandId ? response.brandId.title : null;
          this.product.shortDescription = response.shortDescription;
          this.product.imageUrl = response.thumbnail[0].url;
          this.thumbnails = response.thumbnail;
          this.product.price = response.price;
          this.product.skuParent = response.productID;
          this.product.dummyPrice = response.dummyPrice?response.dummyPrice:"";
          this.product.itemHave = response.stockSize;
          loader.dismiss();
        },
        error => {
          loader.dismiss();
        }
      );
    });
    if (localStorage.getItem("token")) {
      this.productService
        .checkFavourite(this.productId)
        .subscribe((res: any) => {
          this.like = res.resflag;
        });
    }
    this.myForm = new FormGroup({
      listOptions: new FormControl()
    });
  }

  addToCart(productId) {
    if (this.product.size) {
      // it will only execute if user has selected size and color.
      this.itemsInCart = JSON.parse(localStorage.getItem("cart"));
      if (this.itemsInCart == null) {
        // if cart is empty then proceed further.
        this.product.quantity = 1;
        this.product.itemTotalPrice =
          this.product.quantity * this.productDetails.price;
        for (let m = 0; m <= this.productDetails.sizeColors.length - 1; m++) {
          if (this.productDetails.sizeColors[m].colorName == this.product.color) {
            this.product.itemTotalPrice =
              this.productDetails.sizeColors[m].price * this.product.quantity;
            this.product.itemHave = this.productDetails.sizeColors[m].stockSize;
          }
        }

        this.itemInCart.push(this.product);
        localStorage.setItem("cart", JSON.stringify(this.itemInCart));
      } else {
        // if there are already some items in cart , execute this.
        for (let i = 0; i <= this.itemsInCart.length - 1; i++) {
          if (this.itemsInCart[i]._id == productId) {
            // if we add item which is already exists , it splices that item.
            this.itemsInCart.splice(i, 1);
          }
        }
        this.product.quantity = 1;
        this.product.itemTotalPrice =
          this.product.quantity * this.productDetails.price;
        for (let m = 0; m <= this.productDetails.sizeColors.length - 1; m++) {
          if (this.productDetails.sizeColors[m].colorName == this.product.color) {
            this.product.itemTotalPrice =
              this.productDetails.sizeColors[m].price * this.product.quantity;
            this.product.itemHave = this.productDetails.sizeColors[m].stockSize;
          }
        }
        this.itemsInCart.push(this.product);
        localStorage.setItem("cart", JSON.stringify(this.itemsInCart));
      }
      this.navCtrl.push("CartPage");
    } else {
      // if user did'nt select size & color , show alert
      this.showAlert(this.langJSON.product_showAlert ? this.langJSON.product_showAlert : "please select size");
    }
  }

  selectSize(size) {
    this.product.size = size;
  }

  myForm: FormGroup;

  // select color and it will render the thumbnails of selected color.
  selectColor(color, default_color?) {
    this.product.size = "";
    this.productDetails.size = [];
    this.myForm.controls.listOptions.reset();
    if (this.productDetails.color == color) {
      this.thumbnails = this.productDetails.thumbnail;

      this.productDetails.offerPercentage = this.discount;
      this.product.itemTotalPrice = this.productDetails.price;
      this.product.color = color;
      this.product.imageUrl = this.productDetails.imageUrl.url;
      this.productDetails.size = this.sizes;
    } else {
      this.product.color = color;
      for (let i = 0; i < this.productDetails.sizeColors.length; i++) {
        if (this.productDetails.sizeColors[i].colorName == color) {
          this.thumbnails = this.productDetails.sizeColors[i].thumbnail;
          this.product.price = this.productDetails.sizeColors[i].price;
          this.productDetails.offerPercentage = 0;
          this.product.imageUrl = this.thumbnails[0].url;
          this.productDetails.size = this.productDetails.sizeColors[i].size;
        }
      }
    }
  }

  //add to wishlist
  addToFavourite() {
    if (localStorage.getItem("token")) {
      // it will execute only if user loggedin.
      this.productService
        .addToFavourite(this.productId)
        .subscribe((res: any) => {
          this.like = true;
          this.showToaster(this.langJSON.product_addToFavourite_toast1 ? this.langJSON.product_addToFavourite_toast1 : "added to favourites!", 3000);
        });
    } else {
      this.showToaster(this.langJSON.please_login ? this.langJSON.please_login : "Please Login first!", 3000);
    }
  }

  // remove to wishList
  removeToFavourite() {
    if (localStorage.getItem("token")) {
      // it will execute only if user loggedin.
      this.productService
        .removeToFavourite(this.productId)
        .subscribe((res: any) => {
          this.like = false;
          this.showToaster(this.langJSON.product_removeToFavourite_toast1 ? this.langJSON.product_removeToFavourite_toast1 : "removed from favourites!", 3000);
        });
    } else {
      this.showToaster(this.langJSON.please_login ? this.langJSON.please_login : "Please Login first!", 3000);
    }
  }

  showAlert(message) {

    let alert = this.alertCtrl.create({
      title: message,
      buttons: [this.langJSON.OK ? this.langJSON.OK : "OK"]
    });

    alert.present();
  }

  showToaster(message, duration) {
    let toast = this.toasterCtrl.create({
      message: message,
      duration: duration
    });
    toast.present();
  }

  likeToggle() {
    this.like = !this.like;
  }

  // share blog via facebook
  fbSharing() {
    this.socialSharing.shareViaFacebook(
      this.productDetails.description.replace(/(<([^>]+)>)/g, ""),
      this.product.imageUrl,
      "https://play.google.com/store/apps/details?id=io.ionic.ionicfirebaseclothingapp"
    );
  }

  // share blog via Twitter
  twitterSharing() {
    this.socialSharing.shareViaTwitter(
      this.productDetails.description.replace(/(<([^>]+)>)/g, ""),
      this.product.imageUrl,
      "https://play.google.com/store/apps/details?id=io.ionic.ionicfirebaseclothingapp"
    );
  }

  // share blog via google
  googleSharing() {
    this.socialSharing.shareViaEmail(
      this.productDetails.description.replace(/(<([^>]+)>)/g, ""),
      "https://play.google.com/store/apps/details?id=io.ionic.ionicfirebaseclothingapp",
      null
    );
  }

  // share blog via whatsapp
  whatsAppSharing() {
    this.socialSharing.shareViaWhatsApp(
      this.productDetails.description.replace(/(<([^>]+)>)/g, ""),
      this.product.imageUrl,
      "https://play.google.com/store/apps/details?id=io.ionic.ionicfirebaseclothingapp"
    );
  }

  switchGuide(){
    this.showGuide = !this.showGuide;
  }

}
