import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CarProvider } from '../../providers/car/car';
import { MycartProvider } from '../../providers/mycart/mycart';
import { AlertController } from 'ionic-angular';
import { CartPage } from '../cart/cart';

 

@Component({
  selector: 'page-car-detail',
  templateUrl: 'car-detail.html',
})
export class CarDetailPage {
  
  public car;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public carProvider: CarProvider,
    public mycartProvider: MycartProvider,
    private alertCtrl: AlertController,
    
  ) {

  }

  ionViewDidLoad() {
    let ID = this.navParams.get('ID');    // التقاط المعرف  
    if(ID){
      ID = Number(ID);                    // تحويل المعرف الى صيغة رقمية
      this.carProvider.getCarByID(ID)     // التواصل مع ملف الخدمة
        .subscribe(
            result => {
              let response:any = result; 
              response.forEach(item => {  //  عمل حلقة على مصفوفة السيارات لتحديد السيارة المستهدفة
                if(item.id == ID){
                  this.car = item; 
                  console.log(this.car);
                }
              });
            },
            error => {
                console.log(error);
            }
       );
    }
  }




  // هدا الحدث يتم تنفيده بعد الضغط على زر الاضافة الى السلة
  addToCart(car:any) {
    this.mycartProvider.addItem(car).then(
      data =>{
        this.presentAlert(); // دالة  تقوم بعرض نافدة تعطي لك رسالة بنجاح الاضافة بعد الضغط على الزر
      });
   }

 // دالة  تقوم بعرض نافدة تعطي لك رسالة بنجاح الاضافة بعد الضغط على الزر
  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Add to Cart',
      subTitle: 'Item was added successfully',
      buttons: ['Close']
    });
    alert.present();
  }
  
  cart(){  // نرسل قيمة المعرف عبر المسار الى صفحة التفاصيل
    this.navCtrl.push(CartPage);
  }
  


}

  
  