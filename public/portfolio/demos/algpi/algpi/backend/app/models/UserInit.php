<?php

class UserInit {
    
    public      $token_facebook     = null;
    public      $id_facebook        = null;
    
    public      $facebookUserInfo   = null;
    public      $facebookIdMatches  = null;
    protected   $facebookUserFields = [
            'id', 
            'email',
            'name',
            'first_name',
            'last_name',
            'locale',
            'timezone',
            'gender',
            'age_range',
            'link'
    ];
    protected   $preliminaryAccessTokenInfo  = null;
    
    public      $facebookError      = null;
    
    public      $longAccessToken    = null;
    public      $accessToken        = null;
    
    
    public function init() {
        $this
            ->initializeToken()
            ->getLongToken()
            ->getFacebookInfo()
            ->verifyTokenMatchesUserId()
            // ->updateUserRecords()
            ->cleanUpForJsonResponse()
        ;
        return $this;
    }
    
    public function initializeToken() 
    {
        $this->accessToken = new \SammyK\FacebookQueryBuilder\AccessToken($this->token_facebook);
        try {
            Facebook::setAccessToken($this->accessToken); 
            $this->accessToken->getInfo();
        } catch (\Exception $e) {
            die('bad facebook token');
        }
        
        return $this;
    }
    
    public function verifyTokenMatchesUserId() {
        /*
        if (isset($this->facebookUserInfo->id)) {
    	    $this->facebookIdMatches = ($this->id_facebook == $this->facebookUserInfo->id);	
		} else {
			$this->facebookIdMatches = false;
		}
		*/
		// disabling this check for now, 
		// due to redirection method required by facebook
		// due to chrome ios incompatibility
		$this->facebookIdMatches = true;  
		return $this;
    }
    
    public function getLongToken() 
    {
        // if this is a short-lived token
        if ( ! $this->accessToken->isLongLived() ) {
            // get long-lived token
            $this->longAccessToken = $this->accessToken->extend();
        } else {
            $this->longAccesToken = $this->accessToken;
        }
        Facebook::setAccessToken($this->accessToken);
        
        return $this;
    }
    
    public function getFacebookInfo() 
    {

        // get facebook user info based upon the token we've received
        $this->facebookUserInfo
            = (object) Facebook::object('me')
                ->fields($this->facebookUserFields)
                ->get()
                ->toArray()
        ;
     
        return $this;
    }
    
    public function updateUserRecords() 
    {
        // if facebook auth failed, do not update our records
        if (    !is_null($this->facebookError)    
             || is_null($this->facebookUserInfo) 
             || !$this->facebookUserInfo) {
            return $this;
        }
        
        // check if facebook info exists for this facebook_user_id
        $this->existingFacebookInfoRecords = 
            FacebookInfo::where('facebook_user_id', '=', $this->facebookUserInfo->id)
                ->count()
        ;
        
        // if count == 0, it doesn't exist, create it
        
        // if no, create the user and then facebook info
        if ($this->existingFacebookInfoRecords == 0) {
            
            $newUser = new User(
                array(
                    'api_key' => User::randomApiKey()
                )  
            );
            $this->newUser = $newUser;
            $this->newUser->save();
            
            $newFacebookInfo = new FacebookInfo(
                array(
                    'user_id'               => $this->newUser->id,
                    'facebook_user_id'      => $this->facebookUserInfo->id,
                    'token_short'           => $this->accessToken->access_token,
                    'token_long'            => $this->longAccessToken->access_token,
                    'email'                 => $this->facebookUserInfo->email,
                    'name'                  => $this->facebookUserInfo->name,
                    'first_name'            => $this->facebookUserInfo->first_name,
                    'last_name'             => $this->facebookUserInfo->last_name,
                    'age_range_min'         => isset($this->facebookUserInfo->age_range['min'])
                                                ? $this->facebookUserInfo->age_range['min']
                                                : null
                                                ,    
                    'age_range_max'         => isset($this->facebookUserInfo->age_range['max'])
                                                ? $this->facebookUserInfo->age_range['max']
                                                : null
                                                ,    
                    'link'                  => $this->facebookUserInfo->link,
                    'gender'                => $this->facebookUserInfo->gender,
                    'locale'                => $this->facebookUserInfo->locale,
                    'timezone'              => $this->facebookUserInfo->timezone,
                    'verified'              => null,      // not in use currently
                    'profile_picture_url'   => null  // not in use currently
                )
            );
            $this->newFacebookInfo = $newFacebookInfo;
            $this->newFacebookInfo->save();
        }
     
        // if count > 1, it exists, load it
        if ($this->existingFacebookInfoRecords > 0) {
            $this->existingFacebookInfo = 
                FacebookInfo::where('facebook_user_id', '=', $this->facebookUserInfo->id)
                    ->firstOrFail()
            ;
            
            // update the tokens
            $this->existingFacebookInfo->token_short = $this->accessToken->access_token;
            if ($this->longAccessToken !== null) {
                $this->existingFacebookInfo->token_long  = $this->longAccessToken->access_token;    
            }
            
            $this->existingFacebookInfo->save();
            
            $this->user = 
                User::with('facebookInfo')
                    ->find($this->existingFacebookInfo->user_id)
            ;
        } else {
            $this->user = 
                User::with('facebookInfo')
                    ->find($this->newUser->id)
            ;
        }
        
        return $this;   
    }
    
    public function cleanUpForJsonResponse() {
        
        unset($this->existingFacebookInfo);
        unset($this->newFacebookInfo);
        unset($this->newUser);
        unset($this->longAccessToken);
        unset($this->accessToken);
        unset($this->existingFacebookInfoRecords);
        unset($this->facebookUserInfo);
        unset($this->token_facebook);

        return $this;
     
    }
    
    public function set($key, $value) {
        $this->$key = $value;
        return $this;
    }
    public function get($key) {
        return $this->$key;
    }
    
    public function checkFacebookToken($token_facebook) {
        $accessToken = new \SammyK\FacebookQueryBuilder\AccessToken($token_facebook);
        try {
            Facebook::setAccessToken($accessToken);
            $this->preliminaryAccessTokenInfo = $accessToken->getInfo()->toArray();
            $this->tokenIsValid = $this->preliminaryAccessTokenInfo['is_valid'];
            if (!$this->tokenIsValid) {
                $this->facebookError = $this->preliminaryAccessTokenInfo['error'];
            }
        } catch (\Exception $e) {
            // die('checkFacebookToken() failed');
            $this->tokenIsValid = false;
        }
        
        return $this->tokenIsValid;
    }

    
    public static function instance() {
        return new static;
    }   


}