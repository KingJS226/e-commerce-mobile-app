import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FooterPage } from './footer';
import { TranslaterModule } from '../../app/translate.module';
@NgModule({
  declarations: [
    FooterPage,
  ],
  imports: [
    IonicPageModule.forChild(FooterPage),
    TranslaterModule
  ],
  exports: [
    FooterPage
  ]
})
export class FooterPageModule {}
