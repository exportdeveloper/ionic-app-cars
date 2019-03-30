<?php
namespace api\modules\v1\models;

use Yii;
use yii\db\ActiveRecord;

class Cars extends ActiveRecord{

    public static function tableName(){
        return 'cars';  // اسم الجدول
    }

    public function rules(){  // القيود حيث توضع الشروط وتعريف اعمد الجداول
        return [
            [['brand', 'reference', 'price', 'image'], 'safe']
        ];
    }

}