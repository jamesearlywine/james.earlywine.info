<?php namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;

use App\Models\GoogleDocSubmitter;
use App\Models\EmailSecurity;

class EmailController extends Controller {

    public function showErrors() {
            
        ini_set('display_errors',1);
        ini_set('display_startup_errors',1);
        error_reporting(-1);

    }    
    
    public function generateFingerprint() {
        if (is_null(\Session::get('fingerprint'))) {
            \Session::put('fingerprint', str_random(40));
        }
        return '';
    }
        
    
    /**
     * @brief   Sends an Email (POST)
     */
    public function postSendEmail(
            Request     $request
    ) {
        
        $from       = \Input::get('from');
        $to         = \Input::get('to');
        $body       = \Input::get('body');        
        $subject    = \Config::get('mail.offerEmailSubjectLine');
        
        // build request object
        $oRequest = new \stdClass();
        $oRequest->apiKey       = \Input::get('apiKey');
        if ($oRequest->apiKey !== \Config::get('api.apiKey')) {
            // echo PHP_EOL . "bad api key";
            // die()
            
            // return empty response (keeps fingerprint persistent across requests)
            return '';
        }
        
        $oRequest->from         = $from;
        $oRequest->to           = $to;
        $oRequest->dirtyBody    = $body;
        $oRequest->subject      = $subject;
        $oRequest->ipaddress = $request->ip();
        $oRequest->datetime  = Carbon::now()->toDateTimeString();
        $oRequest->useragent = $request->server('HTTP_USER_AGENT');
        // session fingerprint
        $oRequest->fingerprint = \Session::get('fingerprint');
        if (is_null($oRequest->fingerprint)) {
            // echo "null fingerprint";
            die();
        }
        
        
        // -- you can add these functionalities if you like
        
        // normalize (limit size, strip html tags)
        $oRequest->body     
            = EmailSecurity::cleanMessage(
                        $oRequest->dirtyBody, // original message
                        \Config::get('emailsecurity.maxMessageLength'), // maxMessageLength
                        true // strip HTML tags
                    );
        
        // blacklist input
        // ..@todo - find a battle-tested profanity detector/filter
        // that or just remove 'http://' and 'www'
        
        // check some stuff for security 
        // (ex: repeated sends from ip address in x minutes?)
        $isOkayToSend = EmailSecurity::isOkayToSend($oRequest);
        
        // record some stuff for security
        // (ex: email send from this ip-address)
        EmailSecurity::log($oRequest);
        
        
        if ($isOkayToSend) {
            // send email
            \Mail::send(
                // view templates for composing email body
                [
                    'text'  => 'emails.shared_offer_text',
                    'html'  => 'emails.shared_offer_html'
                ],
                // variables to pass to the view template
                [
                    'from'  =>  $oRequest->from,
                    'to'    =>  $oRequest->to,
                    'body'  =>  $oRequest->body
                ],
                // configure the email itself
                function($message) use ($oRequest) {
                    $message
                        ->to([$oRequest->to, $oRequest->to])
                        ->subject($oRequest->subject)
                    ;
                }
            ); // end \Mail::send()
        } // end if($isOkayToSend)
        
        
        
        // api response 
        // $oResponse = new \stdClass();
        // $oResponse->request = $oRequest;
        // return \Response::json($oResponse);
        
        // no response to client-side
        // die();
        
        // empty response to client-side
        return '';
        
    }
    
    
    
}
