<?php namespace App\Models;

use App\Models\EmailSend;

/**
 * @brief  This class deals with email security 
 *          - limiting hacking/abuse from email send requests
 *
 * @author James Earlywine - james.earlywine@indystar.com - 317-444-7032
 */
class EmailSecurity {
    
    public function __construct() {
        // stub
    }
    
    // query
    public static function isOkayToSend($emailSend) {
        // not checking for now, will perdiodically check the logs
        // to see if limits are justified.
        // ex: no more than 10 messages to single email address
        // ex: no more than 100 message from an email per hour
        // ex: no more than 1000 messages from an ipaddress per day
        // ex: no more than 50 message from a session fingerprint per day
        // etc
        //
        // We already wrap the message in our much bigger message
        // ..and we strip html and limit their message to 1024 characters
        
        // for now, it's always okay to send
        return true;
    }
    
    public static function cleanMessage(
            $message,
            $maxChars = null,
            $stripHTML = true
    ) {
        
        $strippedMessage = ($stripHTML)
                ? static::stripHTML($message)
                : $message
                ;
        if (is_null($maxChars)) {
            $maxChars = \Config::get('emailsecurity.maxMessageLength');
        }
        $limitedMessage     
            = static::limitSize(   $strippedMessage, 
                                    $maxChars
                                );

        $cleanMessage = $limitedMessage;
        return $cleanMessage;
    }
    
    public static function stripHTML($message) {
        $strippedMessage = strip_tags($message);
        return $strippedMessage;
    }
    
    public static function limitSize($message, $numChars) {
        $limitedMessage = substr($message, 0, $numChars);
        return $limitedMessage;
    }
    
    public static function log($emailSend) {
        // log the email send
        EmailSend::create([
            'datetime'      => $emailSend->datetime,
            'from'          => $emailSend->from,
            'to'            => $emailSend->to,
            'message'       => $emailSend->body,
            'ip_address'    => $emailSend->ipaddress,
            'fingerprint'   => $emailSend->fingerprint
        ]);
    }
    
    
    // return new instance
    public static function instance() {
        return new static();
    }
    
}
