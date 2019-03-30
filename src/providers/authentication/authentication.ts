import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Storage } from '@ionic/storage';  

@Injectable()
export class AuthenticationProvider {

   public baseUrl = 'http://mobile-api.exportdeveloper.com/api/v1';
  //public baseUrl = 'http://localhost/yii-application/api/v1';
  
  constructor(
            public httpClient: HttpClient,         
            public storage : Storage,
    ) { }


  // دالة الاتصال بالخادم  التي تربط الخادم بالتطبيق
  login(data:any){  
    // بيانات الهيدر يمكنك تمرير ماتشاء بالهيدر الى الخادم
    const httpOptions = {
      headers: new HttpHeaders({
        //  'Content-Type':  'multipart/form-data',
          'charset':  'UTF-8',
      })
    };

    let url:string = this.baseUrl+'/user/login';
    return this.httpClient
      .post(url,data ,httpOptions)             // عملية post
      .pipe(
          map((response) => {
                return response;                  // تحويل النتيجة الى المكون
          })
    );
  }

  // دالة حفظ كود توكن
  saveToken(token: string): Promise<any> {
    return this.storage.set('token',token);
  }
 

  profile(token:string){   // تمرير الكود توكن
    // نجهز الهيدر ونقوم بتضمين كود توكن بداخله لكي يلتقطه الخادم 
          const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json',
                'charset':  'UTF-8',
                'Authorization':'Bearer '+ token   // ارسال كود توكن برمز bearer
            })
          };
            let url:string = this.baseUrl+'/user/profile';
            return this.httpClient
              .get(url,httpOptions)             
              .pipe(
                  map((response) => {
                        return response;                 
                  })
            );
  }

    logout(){   
      return this.storage.remove('token');
    }


    register(data:any){  
      const httpOptions = {
        headers: new HttpHeaders({
            'charset':  'UTF-8',
        })
      };

      let url:string = this.baseUrl+'/user/register';
      return this.httpClient
        .post(url,data ,httpOptions)             // عملية post
        .pipe(
            map((response) => {
                  return response;                  // تحويل النتيجة الى المكون
            })
      );
    }

    
}
 