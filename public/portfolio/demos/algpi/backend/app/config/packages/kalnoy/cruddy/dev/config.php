<?php return array(

    // The title of the application. It can be a translation key.
    'brand' => 'IMS GrandPrix CMS',

    // The link to the main page
    'brand_url' => url('/'),

    // The name of the view that is used to render the dashboard.
    // You can specify an entity id prefixing it with `@` like so: `@users`.
    //'dashboard' => 'cruddy::dashboard',
    'dashboard' => '@polls',

    // The URI that is prefixed to all routes of Cruddy.
    'uri' => 'secretkeyabc123',
    
    // when laravel's public folder is not the vhost root
    //'subfolder' => 'backend/public/index.php', 
    'subfolder' => 'backend/public/index.php', 

    // The permissions driver.
    'permissions' => 'stub',

    // The name of the filter that will be used for authentication.
    // I.e. `auth.basic` or `auth`.
    'auth_filter' => null,

    // The default ace theme.
    'ace_theme' => 'chrome',

    // The list of key value pairs where key is the entity id and value is
    // an entity class name. For example:
    //
    // 'users' => 'UserEntity'
    //
    // Class is resolved through the IoC container.
    'entities' =>
    [

    ],

    // Main menu items.
    //
    // How to define menu items: https://github.com/lazychaser/cruddy/wiki/Menu
    'menu' =>
    [

    ],


    // The menu that is displayed to the right of the main menu.
    'service_menu' =>
    [

    ],
);
