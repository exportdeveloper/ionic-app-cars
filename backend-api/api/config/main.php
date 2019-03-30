<?php
$params = array_merge(
    require(__DIR__ . '/../../common/config/params.php'),
    require(__DIR__ . '/../../common/config/params-local.php'),
    require(__DIR__ . '/params.php'),
    require(__DIR__ . '/params-local.php')
);
return [
    'id' => 'app-api',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    'modules' => [
        'v1' => [
            'basePath' => '@app/modules/v1',
            'class' => 'api\modules\v1\Module'
        ]
    ],
    'components' => [

        'errorHandler' => [
            'errorAction' => 'site/error',
        ],

        'user' => [
            'identityClass' => 'api\modules\v1\models\User', // هنا نحدد مسار موديل المستخدمين
            'enableAutoLogin' => true,
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],

        // + ionic
        'request' => [
            'enableCsrfValidation' => false,
            'parsers' => [
                'application/json' => 'yii\web\JsonParser',                 // To enable parsing for JSON requests
                'multipart/form-data' => 'yii\web\MultipartFormDataParser',
            ]
        ],

        'urlManager' => [
            'enablePrettyUrl' => true,
            'enableStrictParsing' => true,
            'showScriptName' => false,
            'rules' => [
                [
                    'class' => 'yii\rest\UrlRule',
                    'controller' => 'v1/cars',       // مسار الكونترولر
                    'pluralize'     => false,        // اتركها بهده القيمة
                    'tokens' => [
                        '{id}' => '<id:\\w+>'
                    ]
                ]
                ,
                [
                    'class' => 'yii\rest\UrlRule',
                    'controller' => 'v1/user',       // مسار الكونترولر
                    'pluralize'     => false,
                    'tokens' => [
                        '{id}'             => '<id:\d+>',
                    ],
                    'extraPatterns' => [

                        'POST login'                =>  'login',
                        'OPTIONS login'             =>  'options',

                        'GET profile'                =>  'profile',
                        'OPTIONS profile'             =>  'options',

                        'POST register'                =>  'register',  //+
                        'OPTIONS register'             =>  'options',   //+
                    ],

                ],

              /*  [
                    'class' => 'yii\rest\UrlRule',
                    'controller' => 'v1/user',       // مسار الكونترولر
                    'pluralize'     => false,
                    'tokens' => [
                        '{action}' => '<action:[a-zA-Z0-9\\-]+>',
                    ],
                    'extraPatterns' => [
                        'POST login'                =>  'login',
                        'OPTIONS {action}' => 'options',
                    ]
                ],*/
            ],
        ],
    ],
    'params' => $params,
];