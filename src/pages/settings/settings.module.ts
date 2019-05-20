import { FooterPageModule } from './../footer/footer.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsPage } from './settings';
import { FileUploadModule } from 'ng2-file-upload';
import { TranslaterModule } from '../../app/translate.module';
import { Ng2CloudinaryModule } from 'ng2-cloudinary';

@NgModule({
  declarations: [
    SettingsPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsPage),
    FileUploadModule,
    Ng2CloudinaryModule,
    TranslaterModule,
    FooterPageModule
  ],
  exports: [
    SettingsPage
  ]
})
export class SettingsPageModule { }
