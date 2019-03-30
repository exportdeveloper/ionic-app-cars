<?php
return [
    'components' => [
        'db' => [
            'class' => 'yii\db\Connection',
            'dsn' => 'mysql:host=localhost;dbname=yii2advanced',
            'username' => 'root',
            'password' => 'root',
            'charset' => 'utf8',
        ],
       /* 'db' => [
            'class' => 'yii\db\Connection',
            'dsn' => 'mysql:host=localhost;dbname=exportdeveloper_mobile-app',
            'emulatePrepare' => true,
            // 'enableProfiling' => true,
            'username' => 'exportdeveloper_tests',
            'password' => 'uo$;hMzU4%I9',
            'charset' => 'utf8',
            'tablePrefix' => 'tbl_',
        ],*/
        'mailer' => [
            'class' => 'yii\swiftmailer\Mailer',
            'viewPath' => '@common/mail',
            // send all mails to a file by default. You have to set
            // 'useFileTransport' to false and configure a transport
            // for the mailer to send real emails.
            'useFileTransport' => true,
        ],
    ],
];
