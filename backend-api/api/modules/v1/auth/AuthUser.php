<?php

namespace api\modules\v1\auth;

use Yii;
use yii\db\ActiveRecord;
use yii\db\Expression;
use yii\web\Request as WebRequest;
use Firebase\JWT\JWT;


# add last_login_ip : varchar(50)
# add last_login_at : timestamp
# add access_token_expired_at : timestamp
//query : ALTER TABLE `user` ADD `last_login_ip` VARCHAR(50) NOT NULL AFTER `updated_at`, ADD `last_login_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `last_login_ip`, ADD `access_token_expired_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `last_login_at`;


class AuthUser extends ActiveRecord  {

    public $access_token;
    protected static $decodedToken;

    // build a token
    public function generateAccessTokenAfterUpdatingClientInfo($forceRegenerate=false){
        // update client login, ip
        $this->last_login_ip = Yii::$app->request->userIP;
        $this->last_login_at = new Expression('NOW()');

        // check time is expired or not
        if($forceRegenerate == true
            || $this->access_token_expired_at == null
            || (time() > strtotime($this->access_token_expired_at)))
        {
            // generate access token
            $this->generateAccessToken();
        }
        $this->save(false);
        return true;
    }

    public function generateAccessToken(){
        $tokens = $this->getJWT();
        $this->access_token = $tokens[0];   // Token
        $this->access_token_expired_at = date("Y-m-d H:i:s", $tokens[1]['exp']); // Expire

    }

    public function getJWT(){
        // Collect all the data
        $secret      = static::getSecretKey();
        $currentTime = time();
        $expire      = $currentTime + 86400; // 1 day
        $request     = Yii::$app->request;
        $hostInfo    = '';
        // There is also a \yii\console\Request that doesn't have this property
        if ($request instanceof WebRequest) {
            $hostInfo = $request->hostInfo;
        }

        // Merge token with presets not to miss any params in custom
        // configuration
        $token = array_merge([
            'iat' => $currentTime,      // Issued at: timestamp of token issuing.
            'iss' => $hostInfo,         // Issuer: A string containing the name or identifier of the issuer application. Can be a domain name and can be used to discard tokens from other applications.
            'aud' => $hostInfo,
            'nbf' => $currentTime,       // Not Before: Timestamp of when the token should start being considered valid. Should be equal to or greater than iat. In this case, the token will begin to be valid 10 seconds
            'exp' => $expire,           // Expire: Timestamp of when the token should cease to be valid. Should be greater than iat and nbf. In this case, the token will expire 60 seconds after being issued.
            'data' => [
                'username'      =>  $this->username,
                'lastLoginAt'   =>  $this->last_login_at,
            ]
        ], static::getHeaderToken());
        // Set up id
        $token['jti'] = $this->getJTI();    // JSON Token ID: A unique string, could be used to validate a token, but goes against not having a centralized issuer authority.
        return [JWT::encode($token, $secret, static::getAlgo()), $token];
    }

    protected function getJTI(){
        return $this->getId();
    }

    protected  static function getAlgo(){
        return 'HS256';
    }
    protected static function getSecretKey(){
        return 'eRto47D4Aer12IOkp4Otdzckm4PAs20dq';  // تختار أي كود تريده
    }

    protected static function getHeaderToken(){
        return [];
    }

    public static function findIdentityByAccessToken($token, $type = null){ // remove this function from User.ph
        $secret = static::getSecretKey();
        // Decode token and transform it into array.
        // Firebase\JWT\JWT throws exception if token can not be decoded
        try {
            $decoded = JWT::decode($token, $secret, [static::getAlgo()]);
        } catch (\Exception $e) {
            return false;
        }
        static::$decodedToken = (array) $decoded;
        // If there's no jti param - exception
        if (!isset(static::$decodedToken['jti'])) {
            return false;
        }
        // JTI is unique identifier of user.
        // For more details: https://tools.ietf.org/html/rfc7519#section-4.1.7
        $id = static::$decodedToken['jti'];
        return static::findByJTI($id);
    }



    public static function findByJTI($id){
        $user = static::find()
            ->where(['=', 'id', $id])
          //  ->andWhere([ '=', 'status',  self::STATUS_ACTIVE])
            ->andWhere(['>', 'access_token_expired_at', new Expression('NOW()')])
            ->one();

        if(is_null($user) && $user->getIsConfirmed() == false) {
            return null;
        }
        return $user;
    }

    public function getIsConfirmed(){
        return $this->confirmed_at != null;
    }

}
