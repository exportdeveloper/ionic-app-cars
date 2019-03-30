import { Component, ViewChild } from '@angular/core';
import { Events,Nav, Platform,MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { CartPage } from '../pages/cart/cart';
import { AuthenticationProvider } from '../providers/authentication/authentication';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;  // الصفحة الرئيسية التي ينطلق منها التطبيق عند التشغيل

  pages: Array<{title: string, component: any, icon:string}>;
  accountPages: Array<{title: string, component: any, icon:string}>;

  userButtons: Array<{title: string, component: any , color:string , icon:string}>;
  guestButtons: Array<{title: string, component: any , color:string , icon:string}>;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar,
     public splashScreen: SplashScreen,
     public events: Events,
     public menu: MenuController,
     public authentication: AuthenticationProvider,
     
     ) {
    this.initializeApp();
    this.listenToLoginEvents(); // دالة تفعيل احد القوائم في حال اكتشاف حدث معين

 
    // قائمة الأزرار الاعتيادية التي سيتم عرضها بشكل دائم
    this.pages = [
      { title: 'Home', component: HomePage ,icon:'home'},
      { title: 'My Cart', component: CartPage,icon:'cart' },
      { title: 'About Us', component: HomePage,icon:'cafe' },
      { title: 'Find Us', component: HomePage ,icon:'map'},
      { title: 'Settings', component: HomePage ,icon:'build'},
    ];

    // قائمة الازرار التي تضاف الى مكونات القائمة الجانبية في حال تم تسجيل الدخول
    this.accountPages = [
      { title: 'Orders', component: HomePage ,icon:'clipboard'},
      { title: 'Edit Account', component: HomePage ,icon:'create'},
    ];


    // الازرار العلوية الملونة بالازرق الفاتح والاخضر
    //بالنسبة للزوار
    this.guestButtons = [
      { title: 'Register', component: RegisterPage,color:'primary',icon:'contact' },
      { title: 'Login', component: LoginPage , color:'secondary',icon:'lock' },
    ];


    // بالنسبة للمستخدم الدي قام بتسجيل الدخول
    this.userButtons = [
      { title: 'Account', component: ProfilePage,color:'primary',icon:'contact' },
      { title: 'Logout', component: HomePage , color:'secondary',icon:'log-out' },
    ];

  } // .end constructor

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }


  listenToLoginEvents() {
       this.events.subscribe('user:login', () => {  // التنصت على حدث تسجيل الدخول
         this.enableMenu(true);
       });

      this.events.subscribe('user:logout', () => {  // التنصت على حدث تسجيل الخروج
        this.enableMenu(false);
      });
  }


  enableMenu(loggedIn: boolean) {
    this.menu.enable(loggedIn, 'user-menu'); // ID تفعيل القائمة المشار اليها بهدا المؤشر
    this.menu.enable(!loggedIn, 'guest-menu'); // ID تفعيل القائمة المشار اليها  بالمؤشر
  }
  // exp : id="user-menu"





  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario

        switch (true) {
          case ((page.title == 'Logout')): {  // في حال الضغط على زر تسجيل الخروج
              this.authentication.logout(); // call logout logic method 
              this.events.publish('user:logout'); //logout event
              this.nav.setRoot(HomePage);
          }
          break;

          default: {
            this.nav.setRoot(page.component); // التوجيه الى الصفحة المعنية

            //ملاحظة
            // setRoot تقوم بتحويل الى صفحة جديدة دون امكانية الرجوع للصفحة السابقة
            // push تقوم بتحويلك الى الصفحة الجديدة مع امكانية الرجوع للصفحة السابقة وتضع لك ايقونة الرجوع في اعلى الصفحة
          }
           break;
      }
  }
}
