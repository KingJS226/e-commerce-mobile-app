import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ThankyouPage } from './thankyou';
import { CustomHeaderPageModule } from '../custom-header/custom-header.module';
import { TranslaterModule } from '../../app/translate.module';

@NgModule({
  declarations: [
    ThankyouPage,
  ],
  imports: [
    IonicPageModule.forChild(ThankyouPage),
    CustomHeaderPageModule,
    TranslaterModule
  ],
  exports: [
    ThankyouPage
  ]
})
export class ThankyouPageModule {}
