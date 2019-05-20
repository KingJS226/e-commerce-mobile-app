import { Component } from "@angular/core";
import {
  IonicPage,
  Events,
  NavController,
  NavParams,
  LoadingController,
  ToastController,
  Platform
} from "ionic-angular";
import { SettingService } from "./settings.service";
import { ConstService } from "../../app/constService";
import { TranslateService } from "@ngx-translate/core";
import { CloudinaryOptions, CloudinaryUploader } from "ng2-cloudinary";

@IonicPage()
@Component({
  selector: "page-settings",
  templateUrl: "settings.html",
  providers: [SettingService]
})
export class SettingsPage {
  userInfo: any = {};
  userId: "";
  thumbImg: any;
  langJSON;
  preview: string;
  cloudinaryUpload = {
    cloudName: "dobtnphyt",
    uploadPreset: "yv7z00oe"
    // following are woow's live credential don't use for testing
    // cloudName: 'www-woowbolivia-com',
    // uploadPreset: 'ij7taxxh'
  };

  value: any;
  options = [
    {
      language: "ENGLISH",
      value: "en"
    },
    {
      language: "FRENCH",
      value: "fr"
    },
    {
      language: "ARABIC",
      value: "ar"
    },
    {
      language: "SPANISH",
      value: "de"
    }
  ];

  uploader: CloudinaryUploader = new CloudinaryUploader(
    new CloudinaryOptions(this.cloudinaryUpload)
  );

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public translate: TranslateService,
    public settingService: SettingService,
    public constService: ConstService
  ) {
    let value = localStorage.getItem("language");
    this.value = value != null ? value : "en";
  }

  ionViewDidLoad() {
    this.settingService.getLangJson().subscribe((res: any) => {
      this.langJSON = res;
      if (this.isLoggedin()) {
        let loader = this.loadingCtrl.create({
          content: this.langJSON.please_wait ? this.langJSON.please_wait : 'Please Wait...'
        });
        loader.present();
        this.settingService.getUserInfo().subscribe(
          (response: any) => {
            loader.dismiss();
            this.userId = response._id;
            this.userInfo.name = response.name;
            this.userInfo.imageUrl = response.imageUrl;
            this.userInfo.flag = 0;
            this.userInfo.email = response.email.substr(0,7)=="random-"?"":response.email;
            this.userInfo.contactNumber = response.contactNumber;
            this.translate.use(this.value);
          },
          error => {
            loader.dismiss();
          }
        );
      }
    });
  }

  readUrl(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.preview = event.target.result;
        this.userInfo.flag = 1;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  // set the selected language on clicking the select language.
  changeLanguage() {
    if (this.value == "fr") {
      this.translate.use("fr");
      this.platform.setDir("ltr", true);
    } else if (this.value == "ar") {
      this.platform.setDir("rtl", true);
      this.translate.use("ar");
    } else if (this.value == "de") {
      this.platform.setDir("ltr", true);
      this.translate.use("de");
    } else {
      this.translate.use("en");
      this.platform.setDir("ltr", true);
    }
    localStorage.setItem("language", this.value);
  }

  // make a network request to update the user info.
  updateProfile() {
    let loader = this.loadingCtrl.create({
      content: this.langJSON.please_wait ? this.langJSON.please_wait : 'Please Wait...'
    });
    loader.present();
    var validateEmail = function(email) {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
    var validemail = validateEmail(this.userInfo.email)
    if(this.userInfo.email=="" || !validemail){
      this.showToaster("valid email required", 3000);
      loader.dismiss();
    } else {

      if (this.userInfo.flag == 1) {
        // this will only execute if user uploaded profile picture.
        this.uploader.uploadAll();
        this.uploader.onSuccessItem = (
          item: any,
          response: string,
          status: number,
          headers: any
        ): any => {
          let res: any = JSON.parse(response);
          this.userInfo.imageUrl = res.secure_url;
          //this.userInfo.phoneNumberVerified = false;
          this.settingService
            .updateUserInfo(this.userId, this.userInfo)
            .subscribe((response: any) => {
              this.showToaster(this.langJSON.settings_updateProfile_toast1 ? this.langJSON.settings_updateProfile_toast1 : "profile information updated!", 3000);

              // publish events to app.component.ts for updating profile pic in side-menu bar.
              this.events.publish("imageUrl", this.userInfo.imageUrl);
              loader.dismiss();
              this.navCtrl.push("HomePage");
            });
        };
      } else {
        // update user info excluding profile picture.
        this.settingService
          .updateUserInfo(this.userId, this.userInfo)
          .subscribe((response: any) => {
            this.showToaster(this.langJSON.settings_updateProfile_toast1 ? this.langJSON.settings_updateProfile_toast1 : "profile information updated!", 3000);
            loader.dismiss();
            this.navCtrl.push("HomePage");
          });
      }


    }
    
  }

  

  showToaster(message, duration) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration
    });
    toast.present();
  }

  address() {
    this.navCtrl.push("AddressPage");
  }

  card() {
    this.navCtrl.push("CheckoutPaymentPage");
  }

  updatePassword() {
    this.navCtrl.push("PasswordPage");
  }
  // check whether user logged in or not.
  isLoggedin(): boolean {
    return localStorage.getItem("token") ? true : false;
  }

  login() {
    this.navCtrl.push("LoginPage");
  }
}
