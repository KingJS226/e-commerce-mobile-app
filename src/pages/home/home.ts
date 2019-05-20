import {Component, ElementRef, Input, ViewChild} from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ViewController,
  LoadingController
} from "ionic-angular";
import { HomeService } from "./home.servie";
import {BannerModel, CategoriesModel} from "./home.model";

@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html",
  providers: [HomeService]
})
export class HomePage {
  @ViewChild('expandWrapper', {read: ElementRef}) expandWrapper;
  @ViewChild('slide1') slide: any;
  @Input('expanded') expanded;
  @Input('expandHeight') expandHeight;
  
  menuitems: any[] = [];
  searchBarVisible = true;
  private categories: CategoriesModel[] = [];
  private banners: BannerModel[] = [];
  private featuredProducts: any = [];
  private featuredProducts2: any = [];
  private featuredProducts3: any = [];
  private featuredProducts4: any = [];
  private featuredProducts5: any = [];
  private banner1 = {bannerUrl:""};
  private banner2 = {bannerUrl:""};
  private banner3 = {bannerUrl:""};
  private banner4 = {bannerUrl:""};
  private banner5 = {bannerUrl:""};
  header_data: any;
  langJSON;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public homeService: HomeService
  ) {
    this.header_data = {
      ismenu: true,
      isHome: false,
      isCart: true,
      isSearch: true,
      title: "YOGUE ACTIVEWEAR"
    };
  }

  ionViewDidEnter() {
    // this.slides.autoplayDisableOnInteraction = false;
  }

  ngOnInit() {

    this.getFullMenu();
    
    this.homeService.getLangJson().subscribe((res: any) => {
      this.langJSON = res;

      //get all featured products
      this.homeService.getFeaturedProducts().subscribe(
        (res: any) => {
         
          this.featuredProducts = res;
          for(var ij=0;ij<this.featuredProducts.length;ij++){
            var txt1 = this.featuredProducts[ij].imageUrl.url 
            this.featuredProducts[ij].imageUrl.url = txt1.slice(0, 50) + "w_320,h_450,c_fill,g_auto/" + txt1.slice(50);;
          }
          setTimeout(() =>{
            this.slide.autoplayDisableOnInteraction = false;
          },500)
         
          console.log("featuredsss", this.featuredProducts);
        },
        error => {
          console.log(error);
        }
      );

      //get all featured2 products
      this.homeService.getFeaturedProducts2().subscribe(
        (res: any) => {
         
          this.featuredProducts2 = res;
          for(var ij=0;ij<this.featuredProducts2.length;ij++){
            var txt1 = this.featuredProducts2[ij].imageUrl.url 
            this.featuredProducts2[ij].imageUrl.url = txt1.slice(0, 50) + "w_320,h_450,c_fill,g_auto/" + txt1.slice(50);;
          }
          setTimeout(() =>{
            this.slide.autoplayDisableOnInteraction = false;
          },500)
         
          console.log("featuredsss", this.featuredProducts2);
        },
        error => {
          console.log(error);
        }
      );

      //get all featured3 products
      this.homeService.getFeaturedProducts3().subscribe(
        (res: any) => {
         
          this.featuredProducts3 = res;
          for(var ij=0;ij<this.featuredProducts3.length;ij++){
            var txt1 = this.featuredProducts3[ij].imageUrl.url 
            this.featuredProducts3[ij].imageUrl.url = txt1.slice(0, 50) + "w_320,h_450,c_fill,g_auto/" + txt1.slice(50);;
          }
          setTimeout(() =>{
            this.slide.autoplayDisableOnInteraction = false;
          },500)
         
          console.log("featuredsss", this.featuredProducts3);
        },
        error => {
          console.log(error);
        }
      );

      //get all featured2 products
      this.homeService.getFeaturedProducts4().subscribe(
        (res: any) => {
         
          this.featuredProducts4 = res;
          for(var ij=0;ij<this.featuredProducts4.length;ij++){
            var txt1 = this.featuredProducts4[ij].imageUrl.url 
            this.featuredProducts4[ij].imageUrl.url = txt1.slice(0, 50) + "w_320,h_450,c_fill,g_auto/" + txt1.slice(50);;
          }
          setTimeout(() =>{
            this.slide.autoplayDisableOnInteraction = false;
          },500)
         
          console.log("featuredsss", this.featuredProducts4);
        },
        error => {
          console.log(error);
        }
      );

      //get all featured2 products
      this.homeService.getFeaturedProducts5().subscribe(
        (res: any) => {
         
          this.featuredProducts5 = res;
          for(var ij=0;ij<this.featuredProducts5.length;ij++){
            var txt1 = this.featuredProducts5[ij].imageUrl.url 
            this.featuredProducts5[ij].imageUrl.url = txt1.slice(0, 50) + "w_320,h_450,c_fill,g_auto/" + txt1.slice(50);;
          }
          setTimeout(() =>{
            this.slide.autoplayDisableOnInteraction = false;
          },500)
         
          console.log("featuredsss", this.featuredProducts5);
        },
        error => {
          console.log(error);
        }
      );


      //get array of all banners
      this.homeService.getAllBanners().subscribe(
        (res: any) => {
          console.log(res)
          if(res.length){
            for(var ij=0;ij<res.length;ij++){
              if(res[ij].bannerOrder==1) {
                this.banner1 = res[ij]
                this.banner1.bannerUrl = this.banner1.bannerUrl.slice(0, 50) + "w_480/" + this.banner1.bannerUrl.slice(50);
              }
              if(res[ij].bannerOrder==2) {
                this.banner2 = res[ij]
                this.banner2.bannerUrl = this.banner2.bannerUrl.slice(0, 50) + "w_480/" + this.banner2.bannerUrl.slice(50);

              }
              if(res[ij].bannerOrder==3) {
                this.banner3 = res[ij]
                this.banner3.bannerUrl = this.banner3.bannerUrl.slice(0, 50) + "w_480/" + this.banner3.bannerUrl.slice(50);

              }
              if(res[ij].bannerOrder==4) {
                this.banner4 = res[ij]
                this.banner4.bannerUrl = this.banner4.bannerUrl.slice(0, 50) + "w_480/" + this.banner4.bannerUrl.slice(50);

              }
              if(res[ij].bannerOrder==5) {
                this.banner5 = res[ij]
                this.banner4.bannerUrl = this.banner4.bannerUrl.slice(0, 50) + "w_480/" + this.banner4.bannerUrl.slice(50);

              }

            }
          } else {

          }
          console.log(this.banner1)
        },
        error =>{
          this.navCtrl.push("LoginPage");
        }
      );

      

      // get array of all categories
      this.homeService.getAllCategories().subscribe(
        (response: any) => {
          this.categories = response;
        },
        error => {
          // if an error occured , navigate to LoginPage.
          this.navCtrl.push("LoginPage");

        });
    });
  }

  // this will hide back button.
  ionViewWillEnter() {
    this.viewCtrl.showBackButton(false);
    
  }

  searchToggle() {
    this.searchBarVisible = !this.searchBarVisible;
  }

  // navigate to ProductCategoryPage page to show sub-categories.
  public productCategory(categoryId, imageUrl, title) {
    this.navCtrl.push("ProductCategoryPage", {
      categoryId: categoryId,
      imageUrl: imageUrl,
      title: title
    });
  }

  getFullMenu() {
    this.menuitems=[];
      this.homeService.getMenuitems().subscribe(
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

  public productBannerDirect(bannerId, bannerUrl, title){
    this.navCtrl.push("ProductGridViewPage", {
      bannerUrl: bannerUrl,
      title: title,
      bannerId: bannerId
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

// navigate to product-details page.
productDetails(productId, title, categoryID) {
  this.navCtrl.push("ProductPage", {
    productId: productId,
    title: title,
    categoryId: categoryID
  });
}


}
