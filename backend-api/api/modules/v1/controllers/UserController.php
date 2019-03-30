<?php
namespace api\modules\v1\controllers;

use Yii;
use yii\filters\VerbFilter;
use yii\helpers\Html;
use yii\rest\ActiveController;
use api\modules\v1\models\LoginForm;
use yii\web\HttpException;
use yii\filters\auth\CompositeAuth;
use yii\filters\auth\HttpBearerAuth;
use api\modules\v1\models\RegisterForm;

class UserController extends ActiveController{

    public $enableCsrfValidation = false;


    public $modelClass = 'api\modules\v1\models\User';  // ربط الكونترولر بالموديل

    public function behaviors(){
        $behaviors = parent::behaviors();

       // نأمر الخادم بأن يسمح لجميع المصادر بطلب بيانات هده الصفحة
        $behaviors['corsFilter' ] = [
            'class' => \yii\filters\Cors::className(),
            'cors'  => [
                'Origin' => ['*'],       // star allows all domains
                'Access-Control-Request-Method' => [ 'POST', 'GET', 'OPTIONS'], // allows  'POST', 'OPTIONS' Methods
                'Access-Control-Request-Headers' => ['*'],
            ],
        ];

        // JSON نأمر الخادم بأن يرجع البيانات على شكل
        $behaviors['contentNegotiator'] = [
            'class' => \yii\filters\ContentNegotiator::className(),
            'formats' => [
                'application/json' => \yii\web\Response::FORMAT_JSON,
            ],
        ];
        //وضع جدار ناري بالكونترولر وحمايته بالكود المميز  الا في دالة تسجيل الدخول
        $behaviors['authenticator'] = [
            'class' => CompositeAuth::className(),
            'authMethods' => [
                HttpBearerAuth::className(),
            ],
            'except'=>['options', 'login','register'], // استثناء دالة تسجيل الدخول ودالة تسجيل مستخدم جديد
        ];


        return $behaviors;
    }

    // التطبيق سيتصل بهده الميثود وسيمرر اليها بيانات تسجيل الدخول
    // يفترض ان ترجع هده الميثود الكود المميز توكن الى التطبيق في حال صحة البيانات
    // في حال وجود خطأ ما تقوم الدالة برمي خطأ لكي يلتقطه التطبيق ويقوم بعرضه للمستخدم
    public function actionLogin(){
        $model = new LoginForm();
       if(isset(Yii::$app->request->isPost)){    // equivalent => if isset($_POST)
           $_POST = Yii::$app->getRequest()->getBodyParams();
            $data['LoginForm'] = [               // انشاء بيانات الدخول
                'username' => $_POST['username'],
                'password' => $_POST['password'],
            ];

           if($model->load($data) && $model->login()) {   // تحميل البيانات والتحقق من صحتها بقاعدة البيانات
               $user = $model->getUser(); //   $model->getUser() is  user Model
               $user->generateAccessTokenAfterUpdatingClientInfo(true); // توليد الكود token
               $response = \Yii::$app->getResponse();                   //بناء رد من السرفر
               $response->setStatusCode(200);                           // success code
               $id = implode(',', array_values($user->getPrimaryKey(true)));  // ID user from db
               $responseData = [
                   'id'    =>  (int)$id,
                   'access_token' => $user->access_token,                    // الدي تم انشاءه token
               ];
               return $responseData;                                         // ارجاع النتيجة للمستخدم
           }else{
                // رمي خطأ كلمة مرور خاطئة او عدم فهم البيانات القادمة او أن البيانات المستلمة غير مفهومة
                # الكود اربعمئة واثنين وعشرين يعبر عن استقبال البيانات ولكن لم يتمكن الخادم من فهمها أو تحليلها
               throw new HttpException(422, json_encode($model->errors));
           }
       }else{
               throw new HttpException(500, json_encode('Internal Server Error'));
       }
    }




    public function actionRegister(){
        $model = new RegisterForm();  // نمودج موديل لتسجيل مستخدم .
        //نستخدم هدا النوع من النمادج لوضع شروط وقواعد
        $data['RegisterForm'] = Yii::$app->getRequest()->getBodyParams();  // البيانات التي استقبلها الخادم من التطبيق POST
        if ($model->load($data)) {    // شحن نمودج الموديل
            if ($user = $model->signup()) {  // تسجيل البيانات بالجدول في قاعدة البيانات
                return true;
            }else{
                $errors = Html::errorSummary($model, ['header' => '']);
                throw new HttpException(422, $errors); # Validation error  //رمي خطأ ادا لم تتطابق القواعد مع البيانات المستقبلة
            }
        }else{
            throw new HttpException(500, json_encode('action model')); # Validation error
        }
    }




    public function actionProfile(){
        $model = \api\modules\v1\models\User::find()
            ->select(['id','lastname','firstname', 'username','email'])
            ->where(['id' => Yii::$app->user->getId()])
            ->one();
        return $model;
    }
}