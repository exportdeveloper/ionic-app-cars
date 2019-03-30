import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';   // سنستعمل خاصية الخازن التي تسمح بتخزين البيانات في تطبيقك 


 // بيانات السيارة التي سنقوم بتخزينها في اللوكال ستوريج
export interface Item{
  id:Number,
  reference:string,
  brand:string,
  price:Number,
  quantity:Number,
  image:string,
}

 // بيانات السلة التي سنقوم بتخزينها في اللوكال ستوريج حيث ستحتوي على مصفوفة من السيارات +السعر الاجمالي والكمية الاجمالية
export interface Cart{  
  cars:Item[],
  total:number,
  totalQty:number,
}



@Injectable()
export class MycartProvider {

  constructor(
           public http    : HttpClient,
           public storage : Storage,
    ) {
     
   }

  // جلب بيانات متغيرات من المخزن 
  getValue(key: string): Promise<any> {
    return this.storage.get(key);
  }

  // اضافة او تعديل على بيانات في المخزن
  setValue(key: string,data: any): Promise<any> {
    return this.storage.set(key,data);
  }




  // دالة الاضافة الى السلة
  addItem(item:any) {
    return new Promise(resolve => {
      this.storage.get('cart').then((CartStorage) => { 
       let newItem:Item ={
        id        : item.id,
        reference : item.reference,
        brand     : item.brand,
        price     : item.price,
        image     : item.image,
        quantity  : 1,
      };
      let tempCartStorage = CartStorage;
      if(tempCartStorage != null){
        let updateItem = tempCartStorage.find(item => item.id === newItem.id);
        if(updateItem == null){
          tempCartStorage.push(newItem); // push new item to cart
        }else{
          updateItem.quantity = Number(updateItem.quantity)+1;
          var key:number = tempCartStorage.indexOf(updateItem);
          tempCartStorage[key] = updateItem;
        }
      }else{
        tempCartStorage = [newItem];
      }
      this.setValue('cart',tempCartStorage);
      resolve(tempCartStorage);
      });
    })
  }

  


      // change quantity function
      setQuantity(item:any,quantityValue:number) {
        return new Promise(resolve => {
          this.storage.get('cart').then((CartStorage) => { 
          let tempCartStorage = CartStorage;
          if(tempCartStorage != null){ 
            let updateItem = tempCartStorage.find(car => car.id === item.id);
            if(updateItem != null){
              updateItem.quantity = Number(quantityValue);
              var key:number = tempCartStorage.indexOf(updateItem);
              tempCartStorage[key] = updateItem;
            }
          }
          this.setValue('cart',tempCartStorage);
          resolve(tempCartStorage);
          });
        })
      }

}
