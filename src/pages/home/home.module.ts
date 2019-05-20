import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {HomePage} from './home';
import {FooterPageModule} from '../footer/footer.module';
import {CustomHeaderPageModule} from '../custom-header/custom-header.module';
import { TranslaterModule } from '../../app/translate.module';

@NgModule({
    declarations: [
        HomePage,
    ],
    imports: [
        IonicPageModule.forChild(HomePage),
        CustomHeaderPageModule,
        FooterPageModule,
        TranslaterModule
    ],
    exports: [
        HomePage
    ]
})
export class HomePageModule {
}
