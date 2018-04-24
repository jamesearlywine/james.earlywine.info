<?php

/*
|--------------------------------------------------------------------------
| Register The Artisan Commands
|--------------------------------------------------------------------------
|
| Each available Artisan command must be registered with the console so
| that it is available to be called. We'll register every command so
| the console gets access to each of the command object instances.
|
*/

Artisan::add(new cron);
Artisan::add(new cron_hourly);
Artisan::add(new refreshApiCache);
Artisan::add(new rekeyEntries);
Artisan::add(new initializeNewVoteCounters);
Artisan::add(new logNewVotes);
Artisan::add(new removeOrphanedAssets);

/*
App::before(function($request)
{
    if($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        $statusCode = 204;

        $headers = [
            'Access-Control-Allow-Origin'      => 'http://mydomain.com',
            'Allow'                            => 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers'     => 'Origin, Content-Type, Accept, Authorization, X-Requested-With',
            'Access-Control-Allow-Credentials' => 'true'
        ];

        return Response::make(null, $statusCode, $headers);
    }
});

App::after(function($request, $response)
{
    $response->headers->set('Access-Control-Allow-Origin', 'http://mydomain.com');
    $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    $response->headers->set('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, X-Requested-With');
    $response->headers->set('Access-Control-Allow-Credentials', 'true');
    return $response;
});
*/