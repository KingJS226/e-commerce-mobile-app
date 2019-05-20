import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  AlertController
} from "ionic-angular";
import {
  PayPal,
  PayPalPayment,
  PayPalConfiguration
} from "@ionic-native/paypal";
import { Stripe } from "@ionic-native/stripe";
import { CheckoutPaymentService } from "./checkout-payment.service";
import { SettingService } from "../settings/settings.service";
@IonicPage()
@Component({
  selector: "page-checkout-payment",
  templateUrl: "checkout-payment.html",
  providers: [CheckoutPaymentService, SettingService, PayPal, Stripe]
})
export class CheckoutPaymentPage {
  /** these are paypal sandbox and stripe testing account credentials.
 * to find paypal credentials goto paypal-sandbox official page
 * to find stripe credentials goto stripe's official website
 */
  grandTotal: number;
  orderData: any = {
    cartItems: [],
    shippingDetails: {}
  };
  public loyaltyPercentage: number = 0;
  public loyaltyPoints: number = 0;
  public leftLoyaltyPoint: number = 0;
  public checked: boolean = false;
  public loyaltyLimit: number = 0;
  public payTotal: number = 0;
  public loyaltyObj: any = {};
  public amountDetails: any = {};
  public phoneNum: string = "";
  public userid: string = "";
  public optCode: number;
  public requestable: Boolean = true;
  public onlyLoyaltyPay: boolean = false;
  private payPalEnvironmentSandbox; // = "AcgkbqWGamMa09V5xrhVC8bNP0ec9c37DEcT0rXuh7hqaZ6EyHdGyY4FCwQC-fII-s5p8FL0RL8rWPRB";
  private publishableKey; // = "pk_test_mhy46cSOzzKYuB2MuTWuUb34";
  private stripe_secret_key; // = "sk_test_GsisHcPqciYyG8arVfVe2amE";
  public enableOtpInput: boolean = false;
  public paymentmethods: any;
  public paymentType: string;
  public stripe_card: any = {};
  public paymentDetails: any = {
    paymentStatus: true
  };
  public paymentTypes = [];
  public loyaltyArray: any[] = [];
  private langJSON;
  private localPaymentType;
  public paymentTypesExtra: any = [
    {
      default: true,
      type: "PayPal",
      value: "paypal",
      logo: "assets/img/paypal_logo.jpg"
    },
    {
      default: false,
      type: "Stripe",
      value: "stripe",
      logo: "assets/img/stripe.png"
    },
    {
      default: true,
      type: "ragorpay",
      value: "ragorpay",
      logo: "assets/img/ragorpay.png"
    },
    { default: false, type: 'COD', value: "COD", logo: "" }
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public payPal: PayPal,
    public stripe: Stripe,
    public checkoutPaymentService: CheckoutPaymentService,
    public settingService: SettingService
  ) {

    this.checkoutPaymentService.getPaymentMethod().subscribe((res: any) => {
      console.log(res)
      this.payPalEnvironmentSandbox = res.paypalCredentials ? res.paypalCredentials.sandbox : '';
      this.publishableKey = res.stripeCredentials ? res.stripeCredentials.publishableKey : 'pk_test_mhy46cSOzzKYuB2MuTWuUb34';
      this.stripe_secret_key = res.stripeCredentials ? res.stripeCredentials.secretKet : 'sk_test_GsisHcPqciYyG8arVfVe2amE';
      this.paymentTypesExtra.forEach(item => {
        if (res.paymentmethods.paymentTypes[item.value]) {
          this.paymentTypes.push(item);
          this.paymentmethods = res.paymentmethods;
          console.log("paymenttype", this.paymentTypes);
        }
        // if (item.value == 'COD') {
        //   item.value = res.paymentmethods.cashOnDelivery ? res.paymentmethods.cashOnDelivery.name : 'COD';
        //   this.localPaymentType = res.paymentmethods.cashOnDelivery ? res.paymentmethods.cashOnDelivery.name : 'COD';
        // }
      })
    });
    // console.log(" orderData-" + JSON.stringify(this.orderData));
  }

  ngOnInit() {
    this.paymentType = "ragorpay";
    this.orderData.paymentType = this.paymentType;
    this.getuserInfo();
    this.checkoutPaymentService.getLoyaltyStatus().subscribe(loyalty => {
      this.loyaltyObj = loyalty;
    });
    this.checkoutPaymentService.getLangJson().subscribe((res: any) => {
      this.langJSON = res;
    });
  }

  ionViewWillEnter(){
    this.orderData = this.navParams.get("orderData");
    this.orderData['amount_to_pay'] = this.orderData.grandTotal;
    this.orderData['loyaltypoint_used'] = 0
    console.log("order data", this.orderData);
    this.payTotal = this.orderData.grandTotal;
  }
  // get userId and store to orderData object
  getuserInfo() {
    this.settingService.getUserInfo().subscribe((user: any) => {
      this.orderData.userId = user._id;
      this.loyaltyArray = user.loyaltyPoints;
      this.loyaltyPoints = user.totalLoyaltyPoints;
      console.log("loyalty points", this.loyaltyArray);
    });
  }

  choosePaymentType(paymentType) {
    this.enableOtpInput = false;
    const type = (paymentType == this.localPaymentType) ? 'COD' : paymentType;
    this.paymentType = type;
    console.log(this.paymentType);
    this.orderData.paymentType = type;
    this.paymentDetails.paymentType = type;
  }

  makePayment() {
    this.orderData.date = new Date().getDate();
    this.orderData.month = new Date().getMonth() + 1;
    this.orderData.year = new Date().getFullYear();
    const loader = this.loadingCtrl.create({
      content: this.langJSON.please_wait ? this.langJSON.please_wait : 'Please Wait...'
    });

    if (this.onlyLoyaltyPay){
      let orderPayment = {
        paymentType: "loyalty point",
        paymentStatus: true
      };
        
      this.orderData.paymentType = "loyaltypoint";
      this.orderData.amount_to_pay = 0;
      
      this.orderData.payment = orderPayment;
      this.orderData.paymentType = "loyalty point";
      // this.orderData.paymentType = "loyalty point";
      this.placeOrder();
      return;
    }

    if (this.paymentType == "paypal") {
      // execute this if user selects stripe payment option.
      const config = {
        PayPalEnvironmentProduction: "",
        PayPalEnvironmentSandbox: this.payPalEnvironmentSandbox
      };
      // place order first before processing the payment .
      this.checkoutPaymentService.placeOrder(this.orderData).subscribe((order: any) => {
        // initialize the paypal sdk with paypal credentials
        this.payPal.init(config).then(() => {
          this.payPal.prepareToRender("PayPalEnvironmentSandbox", new PayPalConfiguration({}))
            .then(() => {
              let payment = new PayPalPayment(this.orderData.grandTotal, "USD", "Description", "sale");
              this.payPal.renderSinglePaymentUI(payment).then(success => {
                /* here we get the transactionId from paypal sdk,
                    store this transaction id  for further usage. */
                this.paymentDetails.transactionId = success.response.id;
                /* update the order with paypal transaction id.
                if everything is fine , navigate to thank you page.*/
                this.checkoutPaymentService
                  .savePaymentDetails(order._id, this.paymentDetails)
                  .subscribe((response: any) => {
                    // congratulations your order is placed successfully.
                    localStorage.removeItem("cart");
                    this.navCtrl.setRoot("ThankyouPage");
                    loader.dismiss();
                  });
              }, error => {
                loader.dismiss();
                this.showAlert(error.message);
              });
            }, error => {
              loader.dismiss();
              this.showAlert(error.message);
            });
        }, error => {
          loader.dismiss();
          this.showAlert(error.message);
        });
      }, error => {
        loader.dismiss();
        this.showAlert(error.message);
      });
    } else if (this.paymentType == "stripe") {
      // execute this if user selects stripe payment option.
      if (this.orderData.grandTotal > 50) {
        /** stripe aacepts amonut greater than 50 ,
         * so check amount wheather it is greater than 50.
         */
        // place order first before processing the payment .
        this.checkoutPaymentService.placeOrder(this.orderData).subscribe((order: any) => {
          // if order is placed successfully , initialize stripe paymment.
          this.stripe.setPublishableKey(this.publishableKey);
          let card = {
            number: this.stripe_card.cardNumber,
            expMonth: this.stripe_card.expiryMonth,
            expYear: this.stripe_card.expiryYear,
            cvc: this.stripe_card.cvc
          };
          this.stripe.createCardToken(card).then(token => {
            /* here we get the token from stripe sdk,
            store this token for further charge API. */
            let stripe_token: any = token;
            if (token) {
              this.checkoutPaymentService.chargeStripe(
                stripe_token.id,
                "USD",
                Math.round(this.orderData.grandTotal),
                this.stripe_secret_key
              ).then(result => {
                /* here we get the balance_transaction from stripe sdk,
                    store this transaction id  for further usage. */
                let res: any = result;
                this.paymentDetails.transactionId = res.balance_transaction;
                this.stripe_card = "";
                /* update the order with stripe transaction id.
                if everything is fine , navigate to thank you page.*/
                this.checkoutPaymentService.savePaymentDetails(order._id, this.paymentDetails)
                  .subscribe((response: any) => {
                    /* congratulations your order is placed successfully.
                      remove the cartItems from local storage and navigate to  ThankyouPage*/
                    loader.dismiss();
                    localStorage.removeItem("cart");
                    this.navCtrl.setRoot("ThankyouPage");
                  }, error => {
                    loader.dismiss();
                    this.showAlert(error.message);
                  });
              }, error => {
                loader.dismiss();
                this.showAlert(error.message);
              });
            }
          }).catch(error => {
            loader.dismiss();
            this.showAlert(error.message);
          });
        }, error => {
          loader.dismiss();
          this.showAlert(error.message);
        });
      } else {
        // if amount paid to stripe is less than 50 , show alert.
        loader.dismiss();
        this.showAlert(this.langJSON.checkout_showAlert ? this.langJSON.checkout_showAlert : "Amount should be greater than 50!");
      }
    } else if (this.paymentType == "COD") {
      // this will only execute if order is placed via COD.
      this.checkoutPaymentService.getOtpCode(this.orderData.shippingDetails.user).subscribe(
        (res: any) => {
          this.requestable =true;
          console.log(res.otpCode);
          console.log("dddd", this.optCode);
          if (res.otpCode){
            console.log(res.otpCode);
            console.log("dddd", this.optCode);
            if (res.otpCode == this.optCode){
              loader.dismiss();
              this.optCode = null;
              this.placeOrder();
            }else {
              this.optCode = null;
              this.showAlert("Please Input Correct Code");
              // this.enableOtpInput = false;
            }
          }
        }
      )
    }else {
      let apikey = this.paymentmethods.ragorpayCredentials.apikey;
      let contact = this.orderData.shippingDetails.mobileNo;
      let name = this.orderData.shippingDetails.userName;
      let amount = this.orderData.amount_to_pay ;
      let image = this.paymentTypesExtra[2].logo;
      let options = {
        description: 'Yogue Activewear Order',
        image: image,
        currency: 'INR',
        key: apikey,
        amount: amount*100,
        name: 'Yogue Activewear',
        prefill: {
          email: '',
          contact: contact,
          name: name
        },
        theme: {
          color: '#F37254'
        },
        modal: {
          ondismiss: function() {
            alert('dismissed')
          }
        }
      };
      let successCallback = (payment_id) =>{
        const loader = this.loadingCtrl.create({
          content: this.langJSON.please_wait ? this.langJSON.please_wait : 'Please Wait...'
        });
        loader.present();
        let amount1 = {
          amount: amount*100
        };
        this.checkoutPaymentService.razorpayPayment(payment_id, amount1).subscribe((res: any)=>{
          console.log(res);
          loader.dismiss();
          let orderPayment = {
            transactionId: res.id,
            paymentType: this.paymentType,
            paymentStatus: true
          };
          this.orderData.payment = orderPayment;
          this.orderData.paymentType = this.paymentType;
          this.placeOrder();
         console.log(this.paymentDetails);
        })
      };

      let cancelCallback = (error) => {
        this.showAlert("Please Pay again. " + error);
      };

      RazorpayCheckout.open(options, successCallback, cancelCallback);
    }
  }

  placeOrder() {
    if (this.checked) {
      this.checked = false;
      this.orderData.point = this.loyaltyPoints-this.leftLoyaltyPoint;
      this.orderData.appliedloyalty = true;
     
    } else {
      this.orderData.point = this.loyaltyPoints-this.leftLoyaltyPoint;
      this.orderData.appliedloyalty = false;
    }
    let loader = this.loadingCtrl.create({
      content: this.langJSON.please_wait ? this.langJSON.please_wait : 'Please Wait...'
    });
    loader.present();
    this.checkoutPaymentService.placeOrder(this.orderData).subscribe((order: any) => {
      console.log("orders", this.orderData);
      loader.dismiss();
      console.log("loyalty",this.leftLoyaltyPoint,this.loyaltyPoints);
      let modifiedSizes: any =[];
     this.orderData.cartItems.forEach(element => {
       modifiedSizes.push({
         name: element.size,
         amount: element.quantity,
         id: element._id
       });
     });
     console.log('modified size', modifiedSizes);
     this.checkoutPaymentService.updateSizeInventories(modifiedSizes).subscribe((res: any) => {
       console.log(res);
     });
      if (this.leftLoyaltyPoint != this.loyaltyPoints){
        this.loyaltyArray.push({
          "createdAt" : Date.now(),
          "credited" : false,
          "point" : this.leftLoyaltyPoint-this.loyaltyPoints
        });
        this.checkoutPaymentService.saveLoyaltyPoints(this.orderData.userId,{loyaltyPoints: this.loyaltyArray, totalLoyaltyPoints:this.leftLoyaltyPoint}).subscribe((user: any)=>{
          console.log('update loyalty',user);
          localStorage.removeItem("cart");
          this.navCtrl.setRoot("ThankyouPage");
        });
      }else {
        /* congratulations your order is placed successfully.
        remove the cartItems from local storage and navigate to  ThankyouPage */
        localStorage.removeItem("cart");
        this.navCtrl.setRoot("ThankyouPage");
      }
    });
  }

  showAlert(message) {
    let alert = this.alertCtrl.create({
      subTitle: message,
      buttons: [this.langJSON.OK ? this.langJSON.OK : "OK"]
    });
    alert.present();
  }

  updateLoyality(event) {
    if (this.loyaltyObj.loyalityProgram) {
      if (this.loyaltyPoints >= this.loyaltyObj.minLoyalityPoints) {
        this.checked = event.value;
        console.log(this.checked);
        if (event.value == true) {
          if (this.payTotal <= this.loyaltyPoints) {
            this.orderData.amount_to_pay = 0;
            this.onlyLoyaltyPay = true;
            this.leftLoyaltyPoint = this.loyaltyPoints - this.payTotal;
          } else if (this.payTotal > this.loyaltyPoints) {
            this.onlyLoyaltyPay = false;
            this.orderData.amount_to_pay = this.payTotal - this.loyaltyPoints;
            this.leftLoyaltyPoint = 0;
          }
          this.orderData.loyaltypoint_used = this.loyaltyPoints - this.leftLoyaltyPoint;
        } else {
          this.onlyLoyaltyPay = false;
          console.log(this.onlyLoyaltyPay);
          this.orderData.amount_to_pay = this.payTotal;
          this.leftLoyaltyPoint = this.loyaltyPoints;
          this.orderData.loyaltypoint_used = 0;
        }
      }
    }
  }


  requestOtp(){
    this.requestable = false;

    this.checkoutPaymentService.getOtpCode(this.orderData.shippingDetails.user).subscribe(
      (res: any) => {
        let user = {
          phone: res.contactNumber,
          id: this.orderData.shippingDetails.user,
          name: res.name==""?" ":res.name
        };
        this.enableOtpInput = true;
        this.checkoutPaymentService.requestOtp(user).subscribe(
          (res) => {
              console.log(res);
          }
        )
      }
    )


  }


}
