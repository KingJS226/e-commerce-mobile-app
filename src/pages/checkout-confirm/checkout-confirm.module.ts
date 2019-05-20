import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckoutConfirmPage } from './checkout-confirm';
import { TranslaterModule } from '../../app/translate.module';

@NgModule({
  declarations: [
    CheckoutConfirmPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckoutConfirmPage),
    TranslaterModule
  ],
  exports: [
    CheckoutConfirmPage
  ]
})
export class CheckoutConfirmPageModule {}
