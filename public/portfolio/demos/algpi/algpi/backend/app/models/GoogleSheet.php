<?php 
namespace App\Models;

/**
 * @brief   Submits Data to a GoogleDoc 
 *          via the Google FormData Receptor/EndpointURL
 */
class GoogleSheet {
    
    public $type            = null;
    public $formEndpoint    = null;
    public $fieldsMap       = [];
    public $data            = [];
    public $googleFormData  = [];
    public $rawResponse     = null;
    
    public function __construct() {
        
    }
    
    // fluent mutators/accessors
    public function formEndpoint($formEndpoint = null) {
        if (is_null($formEndpoint)) {
            return $this->formEndpoint;
        } else {
            $this->formEndpoint = $formEndpoint;
            return $this;
        }
    }
    public function data($data = null) {
        if (is_null($data)) {
            return $this->data;
        } else {
            $this->data = $data;
            return $this;
        }
    }
    public function doc($doc = null) {
        if (is_null($doc)) {
            return $this->doc;
        } else {
            $this->doc = $doc;
            $this->formEndpoint = \Config::get('googlesheet.' . $this->doc . '.submissionsEndpoint');
            $this->fieldsMap    = \Config::get('googlesheet.' . $this->doc . '.fieldsMap');
            return $this;
        } 
    }
    public function rawResponse($rawResponse = null) {
        if (is_null($rawResponse)) {
            return $this->rawResponse;
        } else {
            $this->rawResponse = $rawResponse;
            return $this;
        }
    }
    // execute
    public function submit() {
        // parse the data array, normalizing it for submission 
        $this->_buildGoogleFormData();
        
        // submit via cURL
        $curl_connection = curl_init();
        curl_setopt($curl_connection, CURLOPT_CONNECTTIMEOUT, 60);
        curl_setopt($curl_connection, CURLOPT_USERAGENT,
        "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)");
        curl_setopt($curl_connection, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl_connection, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl_connection, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($curl_connection, CURLOPT_POST, 1);
        curl_setopt($curl_connection, CURLOPT_POSTFIELDS, http_build_query($this->googleFormData));
        curl_setopt($curl_connection, CURLOPT_URL, $this->formEndpoint);
        
        // save rawresponse
        $this->rawResponse(curl_exec($curl_connection));
        curl_close($curl_connection);
        
        return $this;
    }
    // mutate
    public function _buildGoogleFormData() {
        // re-initialize google form data
        $this->googleFormData = [];
        
        // transpore from $this->data use $this->fieldsMap
        foreach($this->fieldsMap as $key => $formField) {
            if (isset($this->data->$key)) {
                $this->googleFormData[$formField] = $this->data->$key;
            }
        }

        return $this;
    }
    // return new instance
    public static function instance() {
        return new static();
    }
    
    /**
     * @brief   Shorthand method to send data to google doc
     * @note    hash|object $options        contains parameters
     * @param   string      $options->doc   see config/googlesheet.php for Google Sheets (indexed by doc)
     * @param   hash|object $options->data  values to submit (indexed by column, see config/googlesheet.php)
     */
    public static function send($options) 
    {
        if (!is_object($options)) {$options = (object) $options;}
        if (!is_object($options->data)) {$options->data = (object) $options->data;}
        return static::instance()
                ->doc($options->doc)
                ->data($options->data)
                ->submit()
        ;
    }
    
    
}
