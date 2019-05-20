import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  LoadingController
} from "ionic-angular";
import { RatingService } from "./rating.service";

@IonicPage()
@Component({
  selector: "page-rating",
  templateUrl: "rating.html",
  providers: [RatingService]
})
export class RatingPage {
  review: any = {
    rating: 0,
    comment: ""
  };
  itemId: "";
  index: "";
  orderId: "";
  langJSON;

  //comment

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public ratingService: RatingService,
    private loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    this.review.product = this.navParams.get("productId");
    this.review.category = this.navParams.get("categoryId");
    this.review.order = this.navParams.get("orderId");
    this.review.rating = this.navParams.get("rating");
    this.review.comment = this.navParams.get("comment");
    this.ratingService.getLangJson().subscribe((res: any) => {
      this.langJSON = res;
    });
  }

  onSubmit() {
    let loader = this.loadingCtrl.create({
      content: this.langJSON.please_wait ? this.langJSON.please_wait : 'Please Wait...'
    });
    loader.present();
    // post review to the server .
    this.ratingService.submitReview(this.review).subscribe(
      (response: any) => {
        this.review.comment = "";
        loader.dismiss();
        // if review is submitted successfully , show toaster.
        this.createToaster(this.langJSON.rating_onSubmit_toast1 ? this.langJSON.rating_onSubmit_toast1 : "your response is saved successfully.", 3000);
        this.navCtrl.pop();
      },
      error => {
        loader.dismiss();
      }
    );
  }

  createToaster(message, duration) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration
    });
    toast.present();
  }
}
