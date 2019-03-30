import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';  //+ اضف

@Injectable()
export class CarProvider {

  public baseUrl = 'http://mobile-api.exportdeveloper.com';
  //public baseUrl = 'http://localhost/yii-application';

  constructor(public http: HttpClient) {
  }

  getCars(){  
    let url:string = this.baseUrl+'/api/v1/cars';
    return  this.http.get(url)
      .pipe(
        map(res => res) 
      );
  }


  getCarByID(id:number){ 
    let url:string='assets/data/cars.json';
    return  this.http.get(url)
      .pipe(
        map(res => res) 
      );
  }
  


}
