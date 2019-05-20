import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CartPage } from './cart';
import { CustomHeaderPageModule } from '../custom-header/custom-header.module';
import { TranslaterModule } from '../../app/translate.module';
import { FooterPageModule } from '../footer/footer.module';

@NgModule({
  declarations: [
    CartPage,
  ],
  imports: [
    IonicPageModule.forChild(CartPage),
    CustomHeaderPageModule,
    TranslaterModule,
    FooterPageModule
  ],
  exports: [
    CartPage
  ]
})
export class CartPageModule { }
