<?php

abstract class WhoAmI {
    
    
    public static function universal()
    {
        if (!empty(Session::get('google_access_token'))) {
			return static::google();
		}
		if (!empty(Session::get('facebook_access_token'))) {
			return static::facebook();
		}
		if (!empty(Session::get('twitter_access_token'))) {
			return static::twitter();
		}
        return null;
    }
    public static function facebook()
    {
        $access_token = Session::get('facebook_access_token', null);
		if (empty($access_token)) { return null; }
		
		$access_token = (object) $access_token;
		$bearer_token = str_replace('Bearer ', '', $access_token->token);
		
		Facebook::setAccessToken($bearer_token);
		try {
			$facebook_user = Facebook::object('me')->fields('id','name','email','first_name','last_name')->get();
		} catch (Exception $e) { return null; }
		
		$facebook_user = (object) $facebook_user->toArray();
		
		$whoami = [
			'signin'		=> 'facebook',
			'first_name' 	=> $facebook_user->first_name,
			'last_name'	 	=> $facebook_user->last_name,
			'email'			=> $facebook_user->email
		];
        return $whoami;
    }
    public static function google()
    {
        $client = new GuzzleHttp\Client();
        $access_token = Session::get('google_access_token', null);
		if (empty($access_token)) {return null;}
		
		$access_token = (object) $access_token;
		// $access_token->token = 'Bearer ya29..ugK9czZ13tAxSaV8qBJ1NI_9xlAKbgUpkq_AN5g-t8gKD8o22370jEtoG7wdNkBbPCQ';
		
		$profileResponse = $client->request(
			'GET', 'https://www.googleapis.com/plus/v1/people/me/openIdConnect', [
            'headers' => array('Authorization' => $access_token->token )
        ]);
        $profile = (object) json_decode($profileResponse->getBody(), true);
		
		
		$whoami = [
			'signin'		=> 'google',
			'first_name'	=> $profile->given_name,
			'last_name'		=> $profile->family_name,
			'email'			=> $profile->email
		];
		
		return $whoami;
    }
    public static function twitter()
    {
        $access_token = Session::get('twitter_access_token', null);
		if (empty($access_token)) {return null;}
		
		try {
		    Session::put('access_token', Session::get('twitter_access_token'));
			$response = Twitter::getCredentials([
				'include_entities' 	=> true, 
				'skip_status' 		=> false,
				'include_email' 	=> 'true'
			]);
		} catch (Exception $e) {
			return null;
		}
		
		$names = static::parseNamesFromTwitter($response);
		
        $whoami 	= 
		[
			'signin'		=> 'twitter',
			'first_name' 	=> $names->first_name,
			'last_name'		=> $names->last_name,
			'email'			=> $response->email
		];

		return $whoami;
    }
    public static function flush()
    {
        Session::forget('access_token');
		Session::forget('google_access_token');
		Session::forget('facebook_access_token');
		Session::forget('twitter_access_token');
    }
    
    protected static function parseNamesFromTwitter($twitterInfo) {
		// clean input
		$twitter = new stdClass();
		$twitter->name 			= trim($twitterInfo->name);
		$twitter->screen_name 	= trim($twitterInfo->screen_name);
		
		$names = new stdClass();
		
		// if user has a name
		if (!empty($twitter->name)) {
			//  if name has only one word
			if (strpos($twitter->name, ' ') === false) {
				$names->first_name = $twitter->name;
				$names->last_name  = '';
				return $names;
			} else { // if the name has more than one word
				$nameParts = explode(' ', $twitter->name);
				// first name is the first name
				$names->first_name = array_shift($nameParts);
				// last name is the rest
				$names->last_name  = implode(' ', $nameParts);
				return $names;
			}
		}
		
		
	}
    
    
}