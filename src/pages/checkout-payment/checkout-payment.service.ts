import { Injectable } from "@angular/core";
import { ConstService } from "../../app/constService";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

@Injectable()
export class CheckoutPaymentService {
  constructor(private http: HttpClient, public constService: ConstService) { }

  getSavedCards() {
    let authtoken = localStorage.getItem("token");
    const headers = new HttpHeaders().set("Authorization", authtoken);
    return this.http.get(this.constService.url + "api/carddetails", {
      headers: headers
    });
  }

  getCardDetailsById(cardId) {
    let authtoken = localStorage.getItem("token");
    const headers = new HttpHeaders().set("Authorization", authtoken);
    return this.http.get(this.constService.url + "api/carddetails/" + cardId, {
      headers: headers
    });
  }

  addCard(body) {
    let authtoken = localStorage.getItem("token");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authtoken);
    return this.http.post(this.constService.url + "api/carddetails", body, {
      headers: headers
    });
  }

  razorpayPayment(id, body){
    let authtoken = localStorage.getItem("token");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authtoken);
    return this.http.post(this.constService.url + "api/users/razorpay/payment/" + id, body, {
      headers: headers
    })
  }

  placeOrder(body) {
    console.log('place body', body);
    let authtoken = localStorage.getItem("token");
    console.log('place order token',authtoken);
    console.log(typeof authtoken);
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authtoken);
    return this.http.post(this.constService.url + "api/orders", body, {
      headers: headers
    });
  }


  updateSizeInventories(body) {
    console.log('update size body', body);
    let authtoken = localStorage.getItem("token");
    console.log(authtoken);
    console.log(typeof authtoken);
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authtoken);
    return this.http.post(this.constService.url + "api/products/product/size", body, {
      headers: headers
    });
  }

  getLoyaltyStatus() {
    let authtoken = localStorage.getItem("token");
    const headers = new HttpHeaders().set("Authorization", authtoken);
    return this.http.get(this.constService.url + "api/settings", {
      headers: headers
    });
  }

  requestOtp(body: any){
    // let authtoken = localStorage.getItem("token");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      // .set("Authorization", authtoken);
    return this.http.post(this.constService.url+"api/users/otp", body, {
      headers: headers
    })
  }

  chargeStripe(token, currency, amount, stripe_secret_key) {
    let secret_key = stripe_secret_key;
    const headers = new HttpHeaders()
      .set("Content-Type", "application/x-www-form-urlencoded")
      .set("Authorization", "Bearer " + secret_key);
    var params = new HttpParams()
      .set("currency", currency)
      .set("amount", amount)
      .set("description", "description")
      .set("source", token);

    return new Promise(resolve => {
      this.http
        .post("https://api.stripe.com/v1/charges", params, {
          headers: headers
        })
        .subscribe(data => {
          resolve(data);
        });
    });
  }

  savePaymentDetails(orderId, paymentDetails) {
    let body: any = {};
    body.payment = paymentDetails;
    let authtoken = localStorage.getItem("token");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authtoken);
    return this.http.put(
      this.constService.url + "api/orders/" + orderId,
      body,
      {
        headers: headers
      }
    );
  }

  saveLoyaltyPoints(userId, loyaltyData) {
    const body = loyaltyData;
    let authtoken = localStorage.getItem("token");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authtoken);
    return this.http.put(this.constService.url + "api/users/" + userId, body, {
      headers: headers
    });
  }

  getPaymentMethod() {
    let authtoken = localStorage.getItem("token");
    const headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Authorization", authtoken);
    return this.http.get(this.constService.url + "api/paymentmethods", {
      headers: headers
    });
  }

  getOtpCode(id){
    let authtoken = localStorage.getItem("token");
    console.log('token', authtoken);
    const headers = new HttpHeaders()
      .set("Authorization", authtoken);
    return this.http.get(this.constService.url + "api/users/" + id, {
      headers:  headers
    });
  }

  getLangJson() {
    const langName = (localStorage.getItem('language') != null) ? localStorage.getItem('language') : 'en';
    return this.http.get('assets/i18n/' + langName + '.json');
  }
}
