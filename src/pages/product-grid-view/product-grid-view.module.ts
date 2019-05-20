import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductGridViewPage } from './product-grid-view';
import { CustomHeaderPageModule } from '../custom-header/custom-header.module';
import { FooterPageModule } from '../footer/footer.module';
import { Ionic2RatingModule } from 'ionic2-rating';
import { TranslaterModule } from '../../app/translate.module';

@NgModule({
  declarations: [
    ProductGridViewPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductGridViewPage),
    CustomHeaderPageModule,
  	FooterPageModule,
    Ionic2RatingModule,
    TranslaterModule
  ],
  exports: [
    ProductGridViewPage
  ]
})
export class ProductGridViewPageModule {}
