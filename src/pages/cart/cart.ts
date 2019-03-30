import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MycartProvider } from '../../providers/mycart/mycart';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  public cart;

  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     public mycartProvider: MycartProvider,
     private alertCtrl: AlertController,
    ) {
  }

  ionViewDidLoad() {
    // نقوم بجلب البيانات من المخزن ان وجدت
    this.mycartProvider.getValue('cart').then(
      data =>{
        this.cart = data;
      });
  }
 
  changeQuntatity(item:any,quantity:number){
    // عرض نافدة لتغيير الكمية
    let alert = this.alertCtrl.create({
      title: 'Quantity',           // عنوان النافدة
      inputs: [
        {
          name: 'quantity',
          placeholder: 'Quantity',
          value: ''+quantity+'',  // جلب الكمية وعرضها بالنافدة
          
        }
      ],
      buttons: [                  // الازرار المتوفرة بالنافدة
        {
          text: 'Confirm',
          handler: data => {
            let quentity = Number(data.quantity);
            // يجب ان تكون قيمة الكمية اكبر من الصفر
            if(quentity>0){
             this.mycartProvider.setQuantity(item,quentity).then(
              rs =>{
                 //تحديث كافة بيانات السيارات الموجودة بالسلة
                this.mycartProvider.getValue('cart').then(
                  resault =>{
                    this.cart = resault;
                  });
              });
             
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            // no things
          }
        }
        
      ]
    });
    alert.present();
  }
 


}
