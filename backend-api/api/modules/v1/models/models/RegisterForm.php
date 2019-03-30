<?php
namespace api\modules\v1\models; // change namespace

use yii\base\Model;

class RegisterForm extends Model
{

    public $lastname;
    public $firstname;

    public $username;
    public $email;
    public $password;

    public function rules(){  //conditions القواعد
        return [
            [['username','firstname','lastname','email','password' ],'safe'],

            [['username','email' ],'trim'],
            [['username','firstname','lastname','email' ],'required'],
          //  ['username', 'unique', 'targetClass' => '\common\models\User', 'message' => 'This username has already been taken.'],
            ['username', 'string', 'min' => 2, 'max' => 255],
            ['email', 'email'],
            ['email', 'string', 'max' => 255],
        //    ['email', 'unique', 'targetClass' => '\common\models\User', 'message' => 'This email address has already been taken.'],
            ['password', 'string', 'min' => 6],
        ];
    }


    // دالة تقوم بتسجيل المستخدم بقاعدة البيانات مع مراقبة محتوى الحقول حسب القواعد الموجودة بالنمودج rules
    // register هذه الدالة يتم مناداتها عن طريق الكونترلر لاحقا من الميثود
    public function signup(){
        if (!$this->validate()) {
            return null;
        }

        $user = new User();

        $user->username = $this->username;
        $user->firstname = $this->firstname;
        $user->lastname = $this->lastname;
        $user->email = $this->email;
        $user->setPassword($this->password);
        $user->generateAuthKey();
        return $user->save(false) ? $user : null;
    }
}