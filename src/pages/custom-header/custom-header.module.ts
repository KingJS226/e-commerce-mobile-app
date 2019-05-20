import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CustomHeaderPage} from './custom-header';
import { TranslaterModule } from '../../app/translate.module';
@NgModule({
    declarations: [
        CustomHeaderPage,
    ],
    imports: [
        IonicPageModule.forChild(CustomHeaderPage),
        TranslaterModule
    ],
    exports: [
        CustomHeaderPage
    ]
})
export class CustomHeaderPageModule {
}
