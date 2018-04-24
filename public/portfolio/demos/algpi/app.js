/* global angular */
/* global indystar_environment */

angular.module('algpi', [
        // 3rd party dependencies
        'ui.router',
        'ct.ui.router.extras',
        'ui',
        'ngAnimate',
        'ngSanitize',
        'ngValidate',
        'angularSpinner',
        'ngLodash',
        'ui.bootstrap',
        'facebook',
        'panzoom',
        'satellizer',
        'angular-google-gapi',
        

        // routable modules
        'algpi.home',

        // directives
        'racemap',
        'panzoomRaceMap',
        'ipadRaceMap',
        

        // global services
        'ShareService',
        'OmnitureService',
        'BusyAnimationService',
        'BubblesService',
        'TurnShareService'
        
    ])
    
    /**
     * AppConfig
     */
    .constant('AppConfig',
        {
            // see environment.js
            baseURL         : indystar_environment.get('baseURL'),
            assetsBaseURL   : indystar_environment.get('assetsBaseURL'),
            shareSettings   : indystar_environment.get('shareSettings'),
            
            endpoints : {
                entryForm   : 'backend/public/index.php/submitEntry/formfill',
                entrySocial : 'backend/public/index.php/submitEntry/social',
                whoAmI      : 'backend/public/index.php/auth/whoami',
                logout      : 'backend/public/index.php/auth/logout',
                dayNumber   : 'backend/public/index.php/dayNumber'
            },

            entryState: 'home',
            
            omniture : indystar_environment.get('omniture'),
            
            // how long to wait during ajax call before showing loading animation? 
            busyAnimationDebounceDelay : 500, // in ms

            /**
             * Mobile Racemap Config
             */
            panzoomRaceMap : {
                // map initialization
                // docs: https://github.com/mvindahl/angular-pan-zoom
                panZoomInit : {
                    initialZoomLevel: 2,
                    initialPanX: 0,
                    initialPanY: 0,
                    
                    neutralZoomLevel: 2,
                    zoomLevels: 8,
                    
                    zoomStepDuration: .20,
                    scalePerZoomLevel: 1.2,
              
                    useHardwareAcceleration: false,
                    chromeUseTransform: true,
                    
                    keepInBounds: true,
                    zoomToFitZoomLevelFactor: .75,
                    keepInBoundsRestoreForce: 1,
                    keepInBoundsDragPullback: 1,
                    
                    zoomOnMouseWheel: false,
                    invertMouseWheel: true,
                    
                    friction: 4,
                },
                // responsive breakpoints
                breakpoints : [
                    // min-screen width (in px)
                    300,
                    400,
                    500,
                    600,
                    768,
                    992,
                    1200
                ],
                turnLocations : {
                    'none' : 'none',
                    1  : 'swquad',
                    2  : 'swquad',
                    3  : 'swquad',
                    4  : 'swquad',
                    5  : 'swquad',
                    6  : 'swquad',
                    7  : 'midne',
                    8  : 'midne',
                    9  : 'midne',
                    10 : 'midne',
                    11 : 'farne',
                    12 : 'farse',
                    13 : 'farse',
                    14 : 'farse'
                },
                // map camera focus
                panZoomStates : {
                    // no turn focused
                    'none' : {
                        // for breakpoint min-px - works for all
                        300     : { zoomToFitParams : { x: 30,  y: 23,  width: 220, height: 125, zoom: 2 } },
                        400     : { zoomToFitParams : { x: 60,  y: 46,  width: 441, height: 250, zoom: 2 } },
                        500     : { zoomToFitParams : { x: 60,  y: 46,  width: 441, height: 250, zoom: 2 } },
                        600     : { zoomToFitParams : { x: 60,  y: 46,  width: 441, height: 250, zoom: 2 } },
                        768     : { zoomToFitParams : { x: 92,  y: 70,  width: 671, height: 380, zoom: 2 } },
                        992     : { zoomToFitParams : { x: 92,  y: 70,  width: 671, height: 380, zoom: 2 } },
                        1200    : { zoomToFitParams : { x: 92,  y: 70,  width: 671, height: 380, zoom: 2 } },
                    },
                    
                    // southwest quad
                    'swquad' : {
                        // for breakpoint min-px
                        300     : { zoomToFitParams : { x: 210, y: 105, width: 1,   height: 100, zoom: 4 } },
                        400     : { zoomToFitParams : { x: 210, y: 105, width: 1,   height: 1,   zoom: 4 } },
                        500     : { zoomToFitParams : { x: 210, y: 105, width: 1,   height: 1,   zoom: 4 } },
                        600     : { zoomToFitParams : { x: 210, y: 105, width: 1,   height: 1,   zoom: 4 } },
                        768     : { zoomToFitParams : { x: 210, y: 105, width: 1,   height: 1,   zoom: 4 } },
                        992     : { zoomToFitParams : { x: 210, y: 105, width: 1,   height: 1,   zoom: 4 } },
                        1200    : { zoomToFitParams : { x: 210, y: 105, width: 1,   height: 1,   zoom: 4 } },
                    },
                    
                    // mid northeast
                    'midne' : {
                        // for breakpoint min-px
                        300     : { zoomToFitParams : { x: 210, y: 105, width: 1,   height: 100, zoom: 4 } },
                        400     : { zoomToFitParams : { x: 210, y: 105, width: 1,   height: 1,   zoom: 4 } },
                        500     : { zoomToFitParams : { x: 210, y: 105, width: 1,   height: 1,   zoom: 4 } },
                        600     : { zoomToFitParams : { x: 210, y: 105, width: 1,   height: 1,   zoom: 4 } },
                        768     : { zoomToFitParams : { x: 210, y: 105, width: 1,   height: 1,   zoom: 4 } },
                        992     : { zoomToFitParams : { x: 210, y: 105, width: 1,   height: 1,   zoom: 4 } },
                        1200    : { zoomToFitParams : { x: 210, y: 105, width: 1,   height: 1,   zoom: 4 } },
                    },
                        
                    // far northeast
                    'farne' : {
                        // for breakpoint min-px
                        300     : { zoomToFitParams : { x: 210, y: 105, width: 1,   height: 100, zoom: 4 } },
                        400     : { zoomToFitParams : { x: 210, y: 105, width: 1,   height: 1,   zoom: 4 } },
                        500     : { zoomToFitParams : { x: 210, y: 105, width: 1,   height: 1,   zoom: 4 } },
                        600     : { zoomToFitParams : { x: 210, y: 105, width: 1,   height: 1,   zoom: 4 } },
                        768     : { zoomToFitParams : { x: 210, y: 105, width: 1,   height: 1,   zoom: 4 } },
                        992     : { zoomToFitParams : { x: 210, y: 105, width: 1,   height: 1,   zoom: 4 } },
                        1200    : { zoomToFitParams : { x: 210, y: 105, width: 1,   height: 1,   zoom: 4 } },
                    },
                        
                    // far southeast
                    'farse' : {
                        // for breakpoint min-px
                        300     : { zoomToFitParams : { x: 210, y: 105, width: 1,   height: 100, zoom: 4 } },
                        400     : { zoomToFitParams : { x: 210, y: 105, width: 1,   height: 1,   zoom: 4 } },
                        500     : { zoomToFitParams : { x: 210, y: 105, width: 1,   height: 1,   zoom: 4 } },
                        600     : { zoomToFitParams : { x: 210, y: 105, width: 1,   height: 1,   zoom: 4 } },
                        768     : { zoomToFitParams : { x: 210, y: 105, width: 1,   height: 1,   zoom: 4 } },
                        992     : { zoomToFitParams : { x: 210, y: 105, width: 1,   height: 1,   zoom: 4 } },
                        1200    : { zoomToFitParams : { x: 210, y: 105, width: 1,   height: 1,   zoom: 4 } },
                    },
                        
                    
                    
                } // end panZoomStates
                
            }, // end racemap 
            
            bubbles : 'see common/js/services/BubblesServices',
            showBubbleOnBoot : true,
            bubbleRangeConstraints : {
                min: 1,
                max: 21
            }
           
           
            
        } // end AppConfig
    )
    
    /**
     * Routing (routes are located in each app module)
     */
    // define default route
    .config(    [   
                    '$urlRouterProvider',
                    function(
                        $urlRouterProvider
                    ) 
                    {
                        $urlRouterProvider.otherwise(function($injector, $location) {
                            // console.log('invalid route, $injector: ', $injector);
                            // console.log('invalid route, $location.absUrl(): ', $location.absUrl());
                            return '/home';   
                        });
                    }
                ]   
            )

    /**
     * Facebook API initialization
     */
    // initialize facebook API access
    .config(    [   
                    'FacebookProvider',
                    'AppConfig',
                    function(
                        FacebookProvider,
                        AppConfig
                    ) 
                    {
                        FacebookProvider.init(AppConfig.shareSettings.facebookAppId);
                    }
                ]   
            )
    /**
     * Satellizer Social Media Login Config
     */
    .config(    [
                    '$authProvider',
                    function($authProvider) {
                        
                        // Facebook
                            // config
                            $authProvider.facebook({
                              clientId: window.indystar_environment.get('shareSettings').facebookAppId,
                              responseType: 'token'
                            });
                            // defaults
                            $authProvider.facebook({
                              name: 'facebook',
                              url: 'http:' + window.indystar_environment.get('baseURL') + '/backend/public/index.php/auth/facebook/callback',
                              authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
                              redirectUri: 'http:' + window.indystar_environment.get('baseURL') + '/backend/public/socialMediaReceptors/facebook.html',
                              requiredUrlParams: ['display', 'scope'],
                              scope: ['email'],
                              scopeDelimiter: ',',
                              display: 'popup',
                              type: '2.0',
                              popupOptions: { width: 580, height: 400 }
                            });
                            
                        // Twitter
                            // config
                            // defaults
                            $authProvider.twitter({
                              url: 'http:' + window.indystar_environment.get('baseURL') + '/backend/public/index.php/auth/twitter/login',
                              authorizationEndpoint: 'https://api.twitter.com/oauth/authorize',
                              loginRedirect: null,
                              redirectUri: 'http:' + window.indystar_environment.get('baseURL') + '/',
                              type: '1.0',
                              popupOptions: { width: 495, height: 645 }
                            });
                            
                        // Google
                            // config
                            $authProvider.google({
                              clientId: window.indystar_environment.get('googleLoginClientId'),
                              responseType: 'token'
                            });
                            // defaults
                            $authProvider.google({
                              url: 'http:' + window.indystar_environment.get('baseURL') + '/backend/public/index.php/auth/google/callback',
                              authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
                              redirectUri: 'http:' + window.indystar_environment.get('baseURL') + '/backend/public/socialMediaReceptors/googleplus.html',
                              requiredUrlParams: ['scope'],
                              optionalUrlParams: ['display'],
                              scope: ['profile', 'email'],
                              scopePrefix: 'openid',
                              scopeDelimiter: ' ',
                              display: 'popup',
                              type: '2.0',
                              popupOptions: { width: 452, height: 633 }
                            }); 

                        
                    }
                ]
    ) // end config auth provider

    

    /**
     * Rootscope config
     */
     .config(   [
                    '$rootScopeProvider',
                    function(
                        $rootScopeProvider
                    )
                    {
                        // digest cycle adjustment
                        $rootScopeProvider.digestTtl(15);
                    }
                ]
            )


    /**
     * rootScope misc. init
     */
    .run(   [   
                '$rootScope',
                '$timeout',
                'AppConfig',
                'ShareService',
                'BusyAnimationService',
                'OmnitureService',
                'TurnShareService',
                'BubblesService',
                'OmnitureService',
                function(
                    $rootScope,
                    $timeout,
                    AppConfig,
                    ShareService,
                    BusyAnimationService,
                    OmnitureService,
                    TurnShareService,
                    BubblesService,
                    OmnitureService
                ) 
                {
                    
                    /**
                     * global handles on Services and rootScope and AppConfig (for debugging in console);
                     */
                    $rootScope.AppConfig        = AppConfig;
                    window.rootScope            = $rootScope;
                    window.OmnitureService      = OmnitureService;
                    window.BusyAnimationService = BusyAnimationService;
                    window.ShareService         = ShareService;
                    window.TurnShareService     = TurnShareService;
                    window.BubblesService       = BubblesService;

                    /**
                     * Omniture Service
                     */
                    OmnitureService.config({
                        section         : AppConfig.omniture.defaults.section,
                        // append ' - (Mobile)' for mobile,  - (iPad) for iPad'
                        showDevice      : AppConfig.omniture.defaults.showDevice,
                        // receive console.log debug info from omniture transport.html
                        debugTransport  : AppConfig.omniture.defaults.debugTransport
                    });
                    
                    /**
                     * Scroll to top on state transition
                     */
                    $rootScope.dontScrollToTopStates = [
                        ''
                    ];
                    $rootScope.$on('$stateChangeSuccess', 
                        function(event, toState, toParams, fromState, fromParams) {
                            if ($rootScope.dontScrollToTopStates.indexOf(toState.name) === -1) {
                                document.body.scrollTop = document.documentElement.scrollTop = 0;
                            }
                        }
                    );
                    $rootScope.$on('$stateChangeStart', 
                        function(event, toState, toParams, fromState, fromParams) {
                            // console.log('toParams: ', JSON.stringify(toParams));
                        }
                    );
                    
                    
                    /** 
                     * busy/loading spinner animation
                     */
                    $rootScope.showBackdrop = false;
                    $rootScope.$on('us-spinner:spin', function(event, key) {
                        // console.log('us-spinner:spin args: ', key);
                        if (key.trim() == 'busy') {
                            $timeout(function() {
                                $rootScope.showBackdrop = true;    
                            }, 0)
                        }
                    });
                    $rootScope.$on('us-spinner:stop', function(event, key) {
                        if (key === undefined) {return}
                        if (key.trim() == 'busy') {
                            $timeout(function() {
                                $rootScope.showBackdrop = false; 
                            }, 0);    
                        }
                    });
                    $rootScope.$on('$stateChangeStart', function() {
                        $rootScope.showBackdrop = false;
                    });
                    
                    
                    /**
                     * Sharing (in the app header (see index.html)
                     */
                    $rootScope.shareSettings = {
                        facebookAppId : indystar_environment.get('shareSettings').facebookAppId,
                        link        :   'http:' + indystar_environment.get('baseURL'),
                        title       : 'IndyStar: IMS Grand Prix - Free Tickets!',
                        description : 'IMS Grand Prix, win free tickets!',
                        caption     :  window.indystar_environment.get('shareSettings').caption,
                        emailSubject : 'IndyStar: Best Fan Experience',
                        emailBody   : 'IndyStar proudly presents the Indiana Sports Awards: Best Fan Experience! '
                                    + 'Fans are encouraged to submit photos and videos as nominations of their favorite high school experiences, including cheers, bands, plays and more. '
                                    + 'Fans will vote on these nominations, with the overall finalists facing off at the year-end awards ceremony in spring 2016 for Best Fan Experience.'
                                    + '\n\n Submit a nominee or cast your vote now:'
                                    + '\n\nhttp:' +indystar_environment.get('baseURL'),
                                    
                        media       : window.indystar_environment.get('shareSettings').media,
                        redirectUrl : window.indystar_environment.get('shareSettings').redirectUrl
                    };
                    $rootScope.initSharing = function() {
                        ShareService.settings($rootScope.shareSettings);
                    };
                    $rootScope.initSharing();
                    
                    
                    /**
                     * Browser / Mobile detection
                     */
                    $rootScope.browserDetection = {
                        'isMobile'      : window.isMobile,
                        'isDesktop'     : !window.isMobile,
                        'isiPad'        : window.isiPad,
                        'isNotiPad'     : !window.isiPad,
                        'isIE'          : window.isIE,
                        'isWebkit'      : window.isWebkit,
                        'isAndroid'     : window.isAndroid,
                        'isNotAndroid'  : !window.isAndroid,
                        'isFirefox'     : window.isFirefox,
                        'isChrome'      : window.isChrome,
                        'isChromeIOS'   : window.isChromeIOS,
                        'isiPhone4'     : window.isiPhone4,
                        'isiPhone5'     : window.isiPhone5,
                        'isIOS'         : window.isIOS
                    };
                 
                 
                    
                }
            ]
        )
 
;

// Multiline Function String - Nate Ferrero - Public Domain
function heredoc (f) {
    return f.toString().match(/\/\*\s*([\s\S]*?)\s*\*\//m)[1];
};

window.globalState = {
    modalHasOpened : false  
};