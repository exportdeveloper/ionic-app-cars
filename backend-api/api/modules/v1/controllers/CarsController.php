<?php
namespace api\modules\v1\controllers;

use Yii;
use yii\rest\ActiveController;

class CarsController extends ActiveController{

    public $modelClass = 'api\modules\v1\models\Cars';  // ربط الكونترولر بالموديل

    public function behaviors(){

        $behaviors = parent::behaviors();
// نأمر الخادم بأن يسمح لجميع المصادر بطلب بيانات هده الصفحة
        $behaviors['corsFilter' ] = [
            'class' => \yii\filters\Cors::className(),
            'cors'  => [
                'Origin' => ['*'],      //paths allowed
            ],
        ];
// JSON نأمر الخادم بأن يرجع البيانات على شكل 
        $behaviors['contentNegotiator'] = [
            'class' => \yii\filters\ContentNegotiator::className(),
            'formats' => [
                'application/json' => \yii\web\Response::FORMAT_JSON,
            ],
        ];
        return $behaviors;
    }

}