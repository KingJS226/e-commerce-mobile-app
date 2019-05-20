import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckoutPaymentPage } from './checkout-payment';
import { TranslaterModule } from '../../app/translate.module';
@NgModule({
  declarations: [
    CheckoutPaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckoutPaymentPage),
    TranslaterModule
  ],
  exports: [
    CheckoutPaymentPage
  ]
})
export class CheckoutPaymentPageModule {}
