import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {AddressPage} from './address';
import { TranslaterModule } from '../../app/translate.module';
@NgModule({
    declarations: [
        AddressPage,
    ],
    imports: [
        IonicPageModule.forChild(AddressPage),
        TranslaterModule
    ],
    exports: [
        AddressPage
    ]
})
export class CheckoutPageModule {
}
