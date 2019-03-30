import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms'; 
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
 
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  public _registerForm:FormGroup;
  public _submitted:boolean = false;
  public errorFields:string = ''; // +

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authenticationProvider: AuthenticationProvider,
    public _formBuilder:FormBuilder,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,

    ) {
      this.createForm(); // تمهيد حقول فورم تسجيل الدخول مباشرة بعد اقلاع الصفحة
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }


  public createForm(){
    this._registerForm = this._formBuilder.group({
      username: ['', Validators.required],
      lastname: ['', Validators.required],
      firstname: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.minLength(4)])],
    });
}


  homePage(){ // في اعلى صفحة تسجيل الدخول ستجد زر يوجهك نحو الصفحة الرئيسية
    this.navCtrl.push(HomePage); 
  }

  loginPage(){ // الزر الدي يوجهك نحو صفحة تسجيل الدخول
    this.navCtrl.push(LoginPage); 
  }
  
   
  onSubmit(dataForm: any) {
    this._submitted = true;  //handler مقبض يعلن عن انه تم الضغط على زر الدخول
    let data:any = { // بناء كائن يمثل بيانات تسجيل الدخول ثم ارسالها الى ملف الخدمة
        firstname: dataForm.firstname,
        lastname: dataForm.lastname,
        username: dataForm.username,
        email: dataForm.email,
        password: dataForm.password,
    }

    let loading = this.loadingCtrl.create({  // انشاء نافدة انتظار
      content: 'Please wait...'
    });    
    loading.present();

    this.authenticationProvider.register(data)
      .subscribe(
          result => {
            let response:any = result;  
            setTimeout(() => {  // غلق نافدة الانتظار
              loading.dismiss();
            }, 500);

            let alert = this.alertCtrl.create({  // انشاء نافدة بعد نجاح التسجيل
              title: 'User Registered',
              subTitle: 'User was added successfully',
              buttons: [  // الازارار التي ستظهر بالنافدة
                {
                  text: 'OK',
                  role: 'cancel',
                  handler: () => {  // حدث مابعد الضغط على الزر
                    this.navCtrl.setRoot(LoginPage); // توجيه المستخدم نحو صفحة الدخول بعد نجاح عملية التسجيل
                  }
                },

              ],
              enableBackdropDismiss: false ,

            });
            alert.present();

          },
          errors => {
            setTimeout(() => {  // غلق نافدة الانتظار
              loading.dismiss();
            }, 500);

            if(errors.status==422){
              //  let errorFields = JSON.parse(errors.error.message); // تحويل محتوى الرسالة الى كائن json
               this.errorFields = errors.error.message;

            }

          }
    );
  }
 
}
