import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';


@IonicPage()
@Component({
    selector: 'page-thankyou',
    templateUrl: 'thankyou.html',
})
export class ThankyouPage {
    header_data: any;
    public thankYouMessage: string;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController) {
        this.header_data = { ismenu: true, isHome: true, isCart: false, isSearch: false, title: (localStorage.getItem('language') == 'de') ? 'Gracias' : 'Thank you' };
    }

    ionViewWillEnter() {
        this.viewCtrl.showBackButton(false);
        if (localStorage.getItem('language') != null) {
            if (localStorage.getItem('language') == 'de') {
                this.thankYouMessage = "Nos contactaremos a la brevedad para realizar su envío. Con cada una de sus compras por este medio, usted aporta al cuidado del medio ambiente al no realizarse catálogos impresos y al mismo tiempo fomenta a las iniciativas bolivianas. Si usted se siente satisfecho con su compra por favor le rogamos nos califique el producto desde la opción de Pedidos. También puede unirse a nuestra FACEBOOK para novedades Nos puede encontrar como Ionicfirebaseapp, muchas gracias.";
            } else if (localStorage.getItem('language') == 'ar') {
                this.thankYouMessage = 'وسوف نتصل بك قريبا لجعل الشحنة الخاصة بك. مع كل مشترياتك بهذه الطريقة، يمكنك المساهمة في رعاية البيئة من خلال عدم إنتاج كتالوجات مطبوعة وفي الوقت نفسه تشجيع المبادرات البوليفية. إذا كنت تشعر بالارتياح مع عملية الشراء، يرجى تقييم المنتج من خيار النظام. يمكنك أيضا الانضمام الفيسبوك لدينا للحصول على الأخبار. يمكنك أن تجد لنا كما ووبوليفيا، شكرا جزيلا لك.';

            } else if (localStorage.getItem('language') == 'fr') {
                this.thankYouMessage = "Nous vous contacterons dans les plus brefs délais pour faire votre envoi. Avec chacun de vos achats par ce moyen, vous contribuez à la protection de l'environnement en ne produisant pas de catalogues imprimés et en encourageant en même temps les initiatives boliviennes. Si vous êtes satisfait de votre achat, veuillez noter le produit dans l'option Commande. Vous pouvez également rejoindre notre FACEBOOK pour des nouvelles. Vous pouvez nous trouver comme ionicfirebaseapp, merci beaucoup."
            } else {
                this.thankYouMessage = "We will be dispatching your shipment shortly. On receiving the product, please share your pics with us on facebook / instagram for a surprise gift, thank you very much.";
            }
        } else {
            this.thankYouMessage = "We will be dispatching your shipment shortly. On receiving the product, please share your pics with us on facebook / instagram for a surprise gift, thank you very much.";
        }
    }

    home() {
        this.navCtrl.setRoot("HomePage");
    }


}
