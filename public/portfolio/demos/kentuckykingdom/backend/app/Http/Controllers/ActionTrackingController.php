<?php namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;

use App\Models\GoogleDocSubmitter;

class ActionTrackingController extends Controller {
    
    public function showErrors() {
            
        ini_set('display_errors',1);
        ini_set('display_startup_errors',1);
        error_reporting(-1);

    }
    /**
     * @brief   Records that someone did some $action
     */
    public function postRecordAction(Request $request) {
        
        // debugging
        $this->showErrors();
        
        // get inputs
        $action = \Input::get('action');
        
        // normalize
        $normalizedAction = strtolower($action);
        // whitelist input
        if( ! in_array($normalizedAction, \Config::get('input.whitelists.actions')) )
        {
            return  \Response::json([
                        'error' => 'That action is not allowed'
                    ]);
        }

        // build request object
        $oRequest = new \stdClass();
        $oRequest->apiKey       = \Input::get('apiKey');
        if ($oRequest->apiKey !== \Config::get('api.apiKey')) {
            // echo PHP_EOL . "bad api key";
            // die()
            
            // return empty response (keeps fingerprint persistent across requests)
            return '';
        }
        
        // action
        $oRequest->action    = $normalizedAction;
        // ipaddress
        $oRequest->ipaddress = $request->ip();
        // datetime
        $oRequest->datetime  = Carbon::now()->toDateTimeString();
        // user-agent
        $oRequest->useragent = $request->server('HTTP_USER_AGENT');
        // session fingerprint
        if (is_null(\Session::get('fingerprint'))) {
            \Session::put('fingerprint', str_random(40));
        }
        $oRequest->fingerprint = \Session::get('fingerprint');
        
        // geo-location based upon ip address
        try {
            $rawresponse = @file_get_contents('https://freegeoip.net/json/' . $oRequest->ipaddress);
        } catch(Exception $e) {
            $oRequest->freegeoip_error -> print_r($e, true);
        }
        $oRequest->rawresponse = $rawresponse;
        if ($rawresponse !== false) {
            $freegeoip_response = json_decode( $rawresponse );
            $oRequest->latitude     = $freegeoip_response->latitude;
            $oRequest->longitude    = $freegeoip_response->longitude;
            $oRequest->city         = $freegeoip_response->city;
            $oRequest->state        = $freegeoip_response->region_name;
        } else {
            $oRequest->latitude     = null;
            $oRequest->longitude    = null;
            $oRequest->city         = null;
            $oRequest->state        = null;
        }
        
        
        // submit to googledoc
        $googleDocSubmitter = GoogleDocSubmitter::instance();
        $googleDocSubmitter
            ->type('action')
            ->data($oRequest)
            ->submit()
        ;
        
        // api response 
        // $oResponse = new \stdClass();
        // $oResponse->request = $oRequest;
        // return \Response::json($oResponse);
        
        // empty response to client-side
        return '';
        
    }
    
    
    
}
