import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms'; 
import { ProfilePage } from '../profile/profile'; //+
import { Events } from 'ionic-angular'; //+
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public _loginForm:FormGroup;
  public _submitted:boolean = false;
  public errorMessage:string=null;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authenticationProvider: AuthenticationProvider,
    public _formBuilder:FormBuilder,
    public loadingCtrl: LoadingController,
    public events: Events,

    ) {
      this.createForm(); // تمهيد حقول فورم تسجيل الدخول مباشرة بعد اقلاع الصفحة
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }


  public createForm(){
    this._loginForm = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
    });
}


  homePage(){ // في اعلى صفحة تسجيل الدخول ستجد زر يوجهك نحو الصفحة الرئيسية
    this.navCtrl.push(HomePage); 
  }

  registerPage(){ // الزر الدي يوجهك نحو صفحة تسجيل الدخول
    this.navCtrl.push(RegisterPage); 
  }

  onSubmit(dataForm: any) {
    this._submitted = true;  //handler مقبض يعلن عن انه تم الضغط على زر الدخول
    let data:any = { // بناء كائن يمثل بيانات تسجيل الدخول ثم ارسالها الى ملف الخدمة
        username: dataForm.username,
        password: dataForm.password,
    }

    let loading = this.loadingCtrl.create({  // انشاء نافدة انتظار
      content: 'Please wait...'
    });    
    loading.present();

    this.authenticationProvider.login(data)
      .subscribe(
          result => {
            let response:any = result;  
            setTimeout(() => {  // غلق نافدة الانتظار
              loading.dismiss();
            }, 500);
            this.authenticationProvider.saveToken(response.access_token).then( // دالة ننشئها بملف الخدمة وضيفتها حفظ الرمز توكن
              res=>{
                this.events.publish('user:login'); // انشاء حدث ينبه القائمة الرئيسية والهدف منه هو اخفاء ازرار تسجيل الدخول
                this.navCtrl.setRoot(ProfilePage); // بعد حفظ التوكن نقوم بتوجيه المستخدم الى صفحة البروفايل
              }); 
          },
          error => {
            setTimeout(() => {  // غلق نافدة الانتظار
              loading.dismiss();
            }, 500);

            if(error.status==422){
              this.errorMessage = 'Incorrect username or password.';
              console.log(error);
            }

          }
    );
  }

}
