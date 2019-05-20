import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductPage } from './product';
import { CustomHeaderPageModule } from '../custom-header/custom-header.module';
import { FooterPageModule } from '../footer/footer.module';
import { TranslaterModule } from '../../app/translate.module';

@NgModule({
  declarations: [
    ProductPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductPage),
    CustomHeaderPageModule,
    FooterPageModule,
    TranslaterModule
  ],
  exports: [
    ProductPage
  ]
})
export class ProductPageModule {}
