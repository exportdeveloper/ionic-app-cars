import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { map } from 'rxjs/operators';  //+
import { CarProvider } from './../../providers/car/car';  //+
import { CarDetailPage } from '../car-detail/car-detail';
import { CartPage } from '../cart/cart';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  searchQuery: string = '';
  cars:any=[];
  filters:any=[];
  
  constructor(
    public navCtrl: NavController,
    public carProvider: CarProvider,
    public loadingCtrl: LoadingController,
  ) {

    this.carProvider.getCars()
      .subscribe(
          result => {
            let response:any = result; 
            this.cars = response; 
            console.log(result); // + من خلال debugger من اجل فحص البيانات بالمتصفح
          },
          error => {
              console.log(error);
          }
    );
  }  

  

  onFilter(ev: any) {
    // set val to the value of the searchbar
    const val = ev.target.value;
    // if the value is an empty string don't filter the items
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });    
    loading.present();
    this.carProvider.getCars()
    .subscribe(
        result => {
          this.cars = result;
          setTimeout(() => {
            loading.dismiss();
          }, 500);
          if (val && val.trim() != '') { 
              this.cars = this.cars.filter((item) => {
               let reference:string = item.reference;
              return (reference.toLowerCase().indexOf(val.toLowerCase()) > -1);
              })
          }
        },
        error => {
            console.log(error);
        }
    );
  }




  detail(id:number){  // نرسل قيمة المعرف عبر المسار الى صفحة التفاصيل
    this.navCtrl.push(CarDetailPage, {
      ID:id, 
    });
  }

  cart(){  // نرسل قيمة المعرف عبر المسار الى صفحة التفاصيل
    this.navCtrl.push(CartPage);
  }
  
  login(){  // 
    this.navCtrl.push(LoginPage);
  }

 

}

