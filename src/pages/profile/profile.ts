import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AuthenticationProvider } from './../../providers/authentication/authentication';
import { Storage } from '@ionic/storage';  


@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  public user:any = null;
  
    constructor(public navCtrl: NavController,
       public navParams: NavParams,
       public authenticationProvider:AuthenticationProvider,
       public storage : Storage,
       ) {
          storage.get('token').then((token) => {  //جلب  كود توكن من داكرة التطبيق
              if(token != null){
                authenticationProvider.profile(token)
                .subscribe(
                    result => {
                      this.user = result; 
                    }
                );
              }else{  // ادا كان توكن غير موجود قم بتحويل المستخدم الى الصفحة الرئيسية
                this.navCtrl.setRoot(HomePage); 
              }
          });
    }
    
    homePage(){ // في اعلى صفحة تسجيل الدخول ستجد زر يوجهك نحو الصفحة الرئيسية
      this.navCtrl.push(HomePage); 
    }

    ionViewDidLoad() {
      console.log('ionViewDidLoad ProfilePage');
    }

}
