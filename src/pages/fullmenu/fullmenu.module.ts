import { FooterPageModule } from './../footer/footer.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FullMenuPage } from './fullmenu';
import { TranslaterModule } from '../../app/translate.module';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    FullMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(FullMenuPage),
    TranslaterModule,
    FooterPageModule,
    ComponentsModule
  ],
  exports: [
    FullMenuPage
  ]
})
export class FullMenuPageModule { }
