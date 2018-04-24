<?php
// indexed by doc 
return [

    'entries' => [
        // for querying the document
        'columns' => [
            'signin'            => 'B',
            'email'             => 'C',
            'first_name'        => 'D',
            'last_name'         => 'E',
            'phone'             => 'F',
        ],
        
        // for submitting data to the document
        // (create googledoc sheet, then form, then view live googledoc form
        //  inspect element on each form element )
        'submissionsEndpoint'    => '',
        'fieldsMap'          => [
            'signin'        => 'entry.636175724', // example: entry.311111965
            'email'         => 'entry.1470355965', // example: entry.311111965
            'first_name'    => 'entry.18213252', // example: entry.311111965
            'last_name'     => 'entry.528473525', // example: entry.311111965
            'phone'         => 'entry.575594295', // example: entry.311111965
        ],
        // endpoint for the spreedsheet (and for querying by column, etc)
        'queryEndpoint'         => '',
        
    ],
    
    
];
