<?php

class UserController extends \BaseController {


    public function __construct()
    {

    }

	/**
	 * Universal WhoAmI service for authenticated users
	 */
	public function getAuthWhoAmI()
	{
		$whoami = WhoAmI::universal();
		if (empty($whoami)) {
			return Response::json(['error' => 'You are not logged in.']);
		}
		return Response::json([
			'whoami'	=> $whoami	
		]);
	}

	/**
	 * Logout of all social media sites (forgets the auth tokens)
	 */
	public function getAuthLogout()
	{
		WhoAmI::flush();
		
		return Response::json([
			'loggedOut' => true	
		]);
	}
    

	/**
	 * Facebook Login
	 */
	public function postAuthFacebookCallback()
	{
		$requestObject = new stdClass();
		$requestObject->input = Input::get();
		if (isset(getallheaders()['Authorization'])) {
			$requestObject->token = getallheaders()['Authorization'];
		} else {
			$requestObject->token = null;
		}
		
		$this->getAuthLogout();
		
		Session::put('facebook_access_token', $requestObject);

		$responseObject = new stdClass();
		$responseObject->requestObject = $requestObject;
		
		return Response::json($responseObject);
	}
	public function getAuthFacebookCallback()
	{
		return $this->postAuthFacebookCallback();
	}
	
	/**
	 * Facebook WhoAmI
	 */
	public function getAuthFacebookWhoAmI()
	{
		$whoami = WhoAmI::facebook();
		if (empty($whoami)) {return Response::json([
			'error' => 'You are not logged into facebook.',
			'whoami' => $whoami
		]);}
		return Response::json([
			'whoami'	=> $whoami	
		]);
	}
	
	/**
	 * Google Login
	 */
	public function postAuthGoogleCallback()
	{
		$requestObject = new stdClass();
		$requestObject->input = Input::get();
		$requestObject->token = getallheaders()['Authorization'];
		
		$this->getAuthLogout();
		Session::put('google_access_token', $requestObject);
		
		$responseObject = new stdClass();
		$responseObject->requestObject = $requestObject;
		
		return Response::json($responseObject);
	}
	
	/**
	 * Google WhoAmI
	 */
	public function getAuthGoogleWhoAmI()
	{
        $whoami = WhoAmI::google();
        if (empty($whoami)) {return Response::json(['error' => 'You are not logged into google']);}
		return Response::json([
			'whoami'	=> $whoami	
		]);
	}
	



	/**
	 * Twitter Login
	 */
	public function postAuthTwitterLogin() 
	{
		$requestObject = new stdClass();
		$requestObject->input 	= Input::get();
		
		$sign_in_twitter = true;
    	$force_login = false;

	    // Make sure we make this request w/o tokens, overwrite the default values in case of login.
	    Twitter::reconfig(['token' => '', 'secret' => '']);
	    $token = Twitter::getRequestToken(route('twitter.callback'));
	
		return Response::make($token);
		
	}

	public function getAuthTwitterCallback() 
	{
		$this->getAuthLogout();
		if (empty(Input::get('oauth_token'))) {
			return Redirect::to('/close');
		}
		Session::set('oauth_request_token', Input::get('oauth_token'));
		
	    if (Session::has('oauth_request_token'))
	    {
	        $request_token = [
	            'token'  => Session::get('oauth_request_token'),
	            'secret' => Session::get('oauth_request_token_secret'),
	        ];
	
	        Twitter::reconfig($request_token);
	
	        $oauth_verifier = false;
	
	        if (Input::has('oauth_verifier'))
	        {
	            $oauth_verifier = Input::get('oauth_verifier');
	        }
			
			$_ENV['oauth_verifier'] = $oauth_verifier;
			
	        // getAccessToken() will reset the token for you
	        $token = Twitter::getAccessToken($oauth_verifier);
	
	        if (!isset($token['oauth_token_secret']))
	        {
	            return Redirect::route('twitter.login')->with('flash_error', 'We could not log you in on Twitter.');
	        }
	
	        $credentials = Twitter::getCredentials();
	
	        if (is_object($credentials) && !isset($credentials->error))
	        {
	            // $credentials contains the Twitter user object with all the info about the user.
	            // Add here your own user logic, store profiles, create new users on your tables...you name it!
	            // Typically you'll want to store at least, user id, name and access tokens
	            // if you want to be able to call the API on behalf of your users.
	
	            // This is also the moment to log in your users if you're using Laravel's Auth class
	            // Auth::login($user) should do the trick.
	
	            Session::put('twitter_access_token', $token);
	
	            return Redirect::to('/close');
	        }
	
	        return Redirect::route('twitter.error');
	    }
	}

	public function getAuthTwitterError()
	{
		$responseObject = [
    		'message' => 'Something went wrong, not logged in to twitter'	
		];
		return Response::json($responseObject);
	}

	public function getAuthTwitterLogout()
	{
		Session::forget('twitter_access_token');
    	$responseObject = [
    		'message' => 'You have logged out of twitter.'	
		];
		return Response::json($responseObject);
	}
	
	public function getAuthTwitterWhoAmI()
	{
		$whoami = WhoAmI::twitter();
		if (empty($whoami)) {
			return Response::json(['error' => 'You are not logged in to twitter.']);
		}
		return Response::json([
			'whoami' => $whoami
		]);
	}
	
	


}
