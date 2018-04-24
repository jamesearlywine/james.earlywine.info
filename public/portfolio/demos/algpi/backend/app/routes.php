<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::get('/', function()
{
	return View::make('hello');
});

/**
 * Auth
 */
// facebook
Route::post('auth/facebook/callback',   ['as' => 'facebook.callback',   'uses' => 'UserController@postAuthFacebookCallback']);
Route::get( 'auth/facebook/callback',   ['as' => 'facebook.callback',   'uses' => 'UserController@getAuthFacebookCallback' ]);
Route::get( 'auth/facebook/whoami',     ['as' => 'facebook.callback',   'uses' => 'UserController@getAuthFacebookWhoAmI'   ]);

// google
Route::post('auth/google/callback',     ['as' => 'facebook.callback',   'uses' => 'UserController@postAuthGoogleCallback']  );
Route::get( 'auth/google/whoami',       ['as' => 'facebook.callback',   'uses' => 'UserController@getAuthGoogleWhoAmI']     );

// universal whoami and logout
Route::get( 'auth/whoami',              ['as' => 'auth.whoami',         'uses' => 'UserController@getAuthWhoAmI']           );
Route::get( 'auth/logout',              ['as' => 'auth.logout',         'uses' => 'UserController@getAuthLogout']           );

Route::get( 'close',    function() { Session::put('code', Input::get('code')); return Response::view('close'); }            );
Route::get( 'session',  function() { return Response::json(Session::all() ); } );
Route::get( 'sessionFlush',     function() {Session::flush();return Redirect::to('session');});


// twitter
/* deprecated - doesn't give us the user's email (only allowed for whitelisted native apps) */
Route::post('auth/twitter/login',    ['as' => 'twitter.login',    'uses' => 'UserController@postAuthTwitterLogin'   ] );
Route::get( 'auth/twitter/callback', ['as' => 'twitter.callback', 'uses' => 'UserController@getAuthTwitterCallback' ] );
Route::get( 'auth/twitter/error',    ['as' => 'twitter.error',    'uses' => 'UserController@getAuthTwitterError'    ] );
Route::get( 'auth/twitter/logout',   ['as' => 'twitter.logout',   'uses' => 'UserController@getAuthTwitterLogout'   ] );
Route::get( 'auth/twitter/whoami',   ['as' => 'twitter.whoami',   'uses' => 'UserController@getAuthTwitterWhoAmI'   ] );

/**
 * Submissions
 */
Route::get( 'submitEntry/social',    ['as' => 'submitEntry.social', 'uses' => 'SubmissionController@getSubmitEntrySocial']);
Route::post('submitEntry/formfill',  ['as' => 'submitEntry.formfill', 'uses' => 'SubmissionController@postSubmitEntryFormFill']);

/**
 * Day Number
 */
Route::get( 'dayNumber',             ['as' => 'dayNumber', 'uses' => 'DayController@getDayNumber'] );

/**
 * Cruddy Config get test
 */
 Route::get('cruddyConfigGet', function() {
     // $uriprefix = Config::get('cruddy::uri');
     // return Response::json($uriprefix);
 });
 


