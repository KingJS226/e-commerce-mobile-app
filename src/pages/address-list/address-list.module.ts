import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddressListPage } from './address-list';
import { CustomHeaderPageModule } from '../custom-header/custom-header.module';
import { TranslaterModule } from '../../app/translate.module';

@NgModule({
  declarations: [
    AddressListPage,
  ],
  imports: [
    IonicPageModule.forChild(AddressListPage),
    CustomHeaderPageModule,
    TranslaterModule
  ],
  exports: [
    AddressListPage
  ]
})
export class AddressListPageModule {}
