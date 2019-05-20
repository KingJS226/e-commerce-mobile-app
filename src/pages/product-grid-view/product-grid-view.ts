import {Component, ElementRef, Input, ViewChild} from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  Content,
} from "ionic-angular";
import { ProductService } from "./product.service";
import { ActionSheetController } from "ionic-angular";


@IonicPage()
@Component({
  selector: "page-product-grid-view",
  templateUrl: "product-grid-view.html",
  providers: [ProductService]
})
export class ProductGridViewPage {
  @ViewChild('expandWrapper', {read: ElementRef}) expandWrapper;
  @ViewChild(Content) content: Content;
  @Input('expanded') expanded;
  @Input('expandHeight') expandHeight;
  menuitems: any[] = [];
  testRadioOpen: boolean;
  testRadioResult;
  searchBarVisible = true;
  like = true;
  subCategoryId: "";
  categoryId: "";
  bannerId: "";
  featuredOrderId: "";
  public products: any[] = [];
  title: "";
  header_data: any;
  isProduct: boolean = true;
  currency;
  langJSON;
  zone: any;
  modeKeys: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    public productService: ProductService
  ) {
    if (this.navParams.get("categoryId")){
      this.subCategoryId = this.navParams.get("subCategoryId");
      this.categoryId = this.navParams.get("categoryId");
      this.title = this.navParams.get("title");
      this.featuredOrderId = this.subCategoryId;
    }
    else if (this.navParams.get("bannerId")){
      this.bannerId = this.navParams.get("bannerId");
      this.title = this.navParams.get("title");
      this.featuredOrderId = this.bannerId;
    }
    this.header_data = {
      ismenu: false,
      isHome: false,
      isCart: true,
      isSearch: true,
      title: this.title
    };
    this.zone = {
      kind: 'Featured'
    }
    this.modeKeys = [
      {title: 'Featured', value: 1},
      {title: 'Alphabetically: A-Z', value: 2},
      {title: 'Alphabetically: Z-A', value: 3},
      {title: 'Price: Low to High', value: 4},
      {title: 'Price: High to Low', value: 5},
    ]
  }
  ionViewWillEnter() {
    
  }
  // show action sheet , for sorting product list.
  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Sort By",
      buttons: [
        {
          text: "High-Low",
          role: "destructive",
          handler: () => {
            console.log("Destructive clicked");
          }
        },
        {
          text: "Low-High",
          handler: () => {
            console.log("Archive clicked");
          }
        },
        {
          text: "Discount",
          role: "destructive",
          handler: () => {
            console.log("Destructive clicked");
          }
        },
        {
          text: "Popularity",
          handler: () => {
            console.log("Archive clicked");
          }
        },
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
          }
        }
      ]
    });
    actionSheet.present();
  }

  ionViewDidLoad() {
    this.currency = localStorage.getItem('currency');
    this.getFullMenu();
    this.productService.getLangJson().subscribe((res: any) => {
      this.langJSON = res;
      let loader = this.loadingCtrl.create({
        content: this.langJSON.please_wait ? this.langJSON.please_wait : 'Please Wait...'
      });
      loader.present();
      if (this.navParams.get("products")) {
        // this will only execute when we navigate to this page from refine page.
        this.products = this.navParams.get("products");
        this.selecte(1);
        console.log("products", this.products);
        if (this.products && this.products.length == 0) {
          // if no product found execute this.
          this.isProduct = false;
        }
        loader.dismiss();
      } else {
        // by default get the array of products.
        if(this.subCategoryId){
          this.productService.getProducts(this.subCategoryId).subscribe(
            (response: any) => {
              this.products = response;
              for(var ij=0;ij<this.products.length;ij++){
                var txt1 = this.products[ij].imageUrl.url 
                this.products[ij].imageUrl.url = txt1.slice(0, 50) + "w_320,h_430,c_fill,g_auto/" + txt1.slice(50);;
              }
              this.selecte(1);
              console.log("products1", this.products);
              loader.dismiss();
            },
            error => {
              loader.dismiss();
            }
          );
        } else if(this.categoryId){
          this.productService.getProductsByCategory(this.categoryId).subscribe(
            (response: any) => {
              this.products = response;
              for(var ij=0;ij<this.products.length;ij++){
                var txt1 = this.products[ij].imageUrl.url 
                this.products[ij].imageUrl.url = txt1.slice(0, 50) + "w_320,h_430,c_fill,g_auto/" + txt1.slice(50);;
              }
              this.selecte(1);
              this.selecte(1);
              console.log("products2", this.products);
              loader.dismiss();
            },
            error => {
              loader.dismiss();
            }
          );
          } else if (this.bannerId){
          this.productService.getProductsTag(this.bannerId).subscribe(
            (res: any) => {
              this.products = res;
              for(var ij=0;ij<this.products.length;ij++){
                var txt1 = this.products[ij].imageUrl.url 
                this.products[ij].imageUrl.url = txt1.slice(0, 50) + "w_320,h_430,c_fill,g_auto/" + txt1.slice(50);;
              }
              console.log("tags products",res);
              this.selecte(1);
              loader.dismiss();
            },
            error =>{
              console.log("tags products",error);
              loader.dismiss();
            }
          )
        } else {
          loader.dismiss();
          this.home()
        }
      }
    });
  }

  searchToggle() {
    this.searchBarVisible = !this.searchBarVisible;
  }

  likeToggle() {
    this.like = !this.like;
  }

  // navigate to product-details page.
  productDetails(productId, title) {
    this.navCtrl.push("ProductPage", {
      productId: productId,
      title: title,
      categoryId: this.categoryId
    });
  }

  // navigate to RefinePage for filter the products.
  refine() {
    this.navCtrl.push("RefinePage", {
      subCategoryId: this.subCategoryId,
      categoryId: this.categoryId,
      title: this.title
    });
  }

  home() {
    this.navCtrl.setRoot("HomePage");
  }

  getFullMenu() {
    this.menuitems=[];
      this.productService.getMenuitems().subscribe(
        (response: any) => {
          if (response != null) {
            response.forEach(item => {
              console.log("category items ", item);
              this.menuitems.push({
                item:item,
                expanded:false
              });
            });
          }

        },
        error => {

        }
      );
      this.content.scrollTo(0,108,100)
  }

  isLoggedin(): boolean {
    return localStorage.getItem("token") ? true : false;
  }

  login() {
    this.navCtrl.push("LoginPage");
  }

  productGridView(subCategoryId, categoryId, title) {
    this.navCtrl.push("ProductGridViewPage", {
      subCategoryId: subCategoryId,
      categoryId: categoryId,
      title: title
    });
  }

  public productCategoryDirect(categoryId, imageUrl, title) {
    this.navCtrl.push("ProductGridViewPage", {
      imageUrl: imageUrl,
      title: title,
      categoryId: categoryId,
      subcategoryId : null
    });
  }

  expandItem(item){
    this.menuitems.map((listItem) => {
      if(item == listItem){
        listItem.expanded = !listItem.expanded;
        console.log("logg", listItem, listItem.expanded);
      } else {
        listItem.expanded = false;
      }
      return listItem;
    });
  }

  selecte(key:any){

    if (this.products.length>0){

      if (key == 2){

        this.products = this.products.sort(function(a, b) {
          let nameA = a.title.toUpperCase(); // ignore upper and lowercase
          let nameB = b.title.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          // names must be equal
          return 0;
        });

      } else if (key == 1) {
        console.log("productssss", this.products);
        this.products = this.products.sort((a, b) => {
          let price1 = 10000;
          let price2 = 10001;
          if (a.featuredOrder){
            if (a.featuredOrder[this.featuredOrderId]){
              price1 = a.featuredOrder[this.featuredOrderId];
            }
          }
          if (b.featuredOrder){
            if (b.featuredOrder[this.featuredOrderId]){
              price2 = b.featuredOrder[this.featuredOrderId];
            }
          }
          
          return price1 - price2;
        });
      }
      else if (key == 3){

        this.products = this.products.sort(function(a, b) {
          let nameA = a.title.toUpperCase(); // ignore upper and lowercase
          let nameB = b.title.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return 1;
          }
          if (nameA > nameB) {
            return -1;
          }

          // names must be equal
          return 0;
        });

      }else if (key == 4){

        this.products = this.products.sort(function (a, b) {
          return a.price - b.price;
        });

      }else {

        this.products = this.products.sort(function (a, b) {
          return b.price - a.price;
        });

      }

    }

  }

}
