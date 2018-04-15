<?php
/**
 * @brief   This is a set of whitelists, to filter user-input values
 *          If an invalid value is passed, the controller stops processing
 *          the request.
 * You can see this in use in:
 * - /backend/app/Http/Controllers/SourceTrackingController.php
 * - /backend/app/Http/Controllers/ActivityTrackingController.php
 * 
 * @author James Earlywine - james.earlywine@indystar.com - 317-444-7032
 */
// **config-point** //
return [
    // whitelists should be lowercased, 
    // input will be lowercased before comparison
    'whitelists' => [
        // valid sources (re: "Where did you hear about this offer')
        'sources' => [
            'indystar',
            'tv',
            'radio',
            'outdoor',
            'other',
            'facebook'
        ],
        // valid actions (re: recording user coupon interactions)
        'actions' => [
            'save',
            'print',
            'share',
            'email'
        ]
    ]
    
];
