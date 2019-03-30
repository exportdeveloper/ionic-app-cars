import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CarProvider } from '../providers/car/car';
import { CarDetailPage } from '../pages/car-detail/car-detail';
import { CartPage } from '../pages/cart/cart';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { MycartProvider } from '../providers/mycart/mycart';
import { IonicStorageModule } from '@ionic/storage';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfilePage } from '../pages/profile/profile';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    CarDetailPage, 
    CartPage,
    LoginPage,
    RegisterPage,
    ProfilePage,
  ],
  imports: [
    ReactiveFormsModule,

    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: ['sqlite', 'websql', 'indexeddb'],
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    CarDetailPage,
    CartPage,
    LoginPage,
    RegisterPage,
    ProfilePage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    CarProvider,
    MycartProvider,
    AuthenticationProvider,
  ]
})
export class AppModule {}
