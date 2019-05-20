import { Component, ViewChild , NgZone} from "@angular/core";
import { Nav, Events, Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { SettingService } from "../pages/settings/settings.service";
import { TranslateService } from "@ngx-translate/core";
import { OneSignal } from '@ionic-native/onesignal';
@Component({
  templateUrl: "app.html",
  providers: [SettingService]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  public oneSignalAppID = "";
  public senderID = "";
  public currency: string;
  rootPage: string;
  user = {
    profilePicture: "assets/img/profile.jpg",
    name: "",
    totalLoyaltyPoints: ""
  };
  constructor(
    public platform: Platform,
    public events: Events,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public settingsService: SettingService,
    private oneSignal: OneSignal,
    private translateService: TranslateService,
    private zone: NgZone
  ) {
    this.initializeApp();
  }

  /*When app starts , set the rootpage as HomePage if user is logged-in ,
 otherwise show WelcomePage */
  ngOnInit() {
    //set default currency type here
    localStorage.setItem('currency', 'Rs. ');
    this.currency = "Rs. ";
    let token = localStorage.getItem("token");
    if (token == null) {
      this.rootPage = "WelcomePage";
    } else {
      this.rootPage = "HomePage";

      // call renderImage function  if user is logged in
      this.renderImage();
    }

    // call listen events function each and every time app starts
    this.listenEvents();

    // call useTranslateService function each and every time app starts
    this.useTranslateService();
  }

  /* set the default language to English if user did'nt select any language from settings.
    If user already selected any language set that language each and every time app starts  */
  private useTranslateService() {
    let value = localStorage.getItem("language");
    let language = value != null ? value : "en";
    localStorage.setItem('language', language);
    language == "ar"
      ? this.platform.setDir("rtl", true)
      : this.platform.setDir("ltr", true);
    this.translateService.use(language);
  }

  /* make network request for getting current user profile pic,
    if user did'nt upload the profile pic set to  default picture  */
  private renderImage() {
    if (this.isLoggedin()) {
      this.settingsService.getUserInfo().subscribe(
        (user: any) => {
          this.user.name = user.name;
          this.user.totalLoyaltyPoints = user.totalLoyaltyPoints;
          this.user.profilePicture =
            user.imageUrl != null
              ? (this.user.profilePicture = user.imageUrl)
              : (this.user.profilePicture = "assets/img/profile.jpg");
        },
        error => {
          this.nav.push("LoginPage");
        }
      );
    }
  }

  // listen for changes in profile picture each and every time.
  public listenEvents() {
    this.events.subscribe("imageUrl", imageUrl => {
      this.user.profilePicture = imageUrl;
      this.renderImage();
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      /* Okay, so the platform is ready and our plugins are available.
         Here you can do any higher level native things you might need.
     this.statusBar.styleDefault(); */
      this.statusBar.overlaysWebView(false);
      this.statusBar.styleDefault();
      this.initializeNotifications();
      this.getIds();
      // this.statusBar.backgroundColorByHexString('#fa2a5c');
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    /* Reset the content nav to have just this page
     we wouldn't want the back button to show in this scenario */
    this.nav.setRoot(page.component);
  }

  isLoggedin() {
    return localStorage.getItem("token") != null;
  }

  home() {
    this.nav.push("HomePage");
  }

  categories() {
    this.nav.push("CategoriesPage");
  }

  orders() {
    this.nav.push("OrdersPage");
  }

  cart() {
    this.nav.push("CartPage");
  }

  wishlist() {
    this.nav.push("WishlistPage");
  }

  settings() {
    this.nav.push("SettingsPage");
  }

  login() {
    this.nav.push("LoginPage");
  }

  tickets() {
    this.nav.push("TicketsPage");
  }

  blog() {
    this.nav.push("BlogListPage");
  }

  // clear data from local storage and navigate to LoginPage
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    this.user.name = "";
    this.user.profilePicture = "assets/img/profile.jpg";
    this.nav.push("LoginPage");
  }


  initializeNotifications() {
    if (this.platform.is('cordova') || this.platform.is('android') || this.platform.is('ios')) {
      this.oneSignal.startInit(this.oneSignalAppID, this.senderID);

      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

      this.oneSignal.handleNotificationReceived().subscribe(() => {
        // works when app is opened foreground or background not closed
        // do something when notification is received
        console.log('Notification recivied');
      });

      this.oneSignal.handleNotificationOpened().subscribe(() => {
        // do something when a notification is opened
        console.log('Notification opened');
      });

      this.oneSignal.endInit();
    } else {
      console.log('Disabled in browser');
    }

  }

  getIds(){
    this.oneSignal.getIds()
      .then(val => {
        localStorage.setItem("deviceToken", val.pushToken);
        localStorage.setItem("userID", val.userId);
        console.log("Device token " + val.pushToken);
        console.log("User ID " + val.userId);
      })
      .catch(err => {
        console.log(err);
      });
  }

  menuOpened() {
      //code to execute when menu ha opened
      console.log("menu opened")
      if (this.isLoggedin()) {
        this.settingsService.getUserInfo().subscribe(
          (user: any) => {
            
            this.zone.run(() => {
              console.log('force update the screen');
              this.user.name = user.name;
              this.user.totalLoyaltyPoints = user.totalLoyaltyPoints;
              this.user.profilePicture =
                user.imageUrl != null
                  ? (this.user.profilePicture = user.imageUrl)
                  : (this.user.profilePicture = "assets/img/profile.jpg");
            });
          },
          error => {
            this.nav.push("LoginPage");
          }
        );
      }
  }
  
}
