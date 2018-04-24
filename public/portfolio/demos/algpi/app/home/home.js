'use strict';
/* global angular */
/* global FB */
/* global twttr */
/* global indystar_environment */
/* global zoomSwitch */
/* global heredoc */
/* global $ */

// mapTest1App.home module/dependencies definition
angular.module  ('algpi.home', 
                    [
                        'ui.router',
                        'panzoom',
                        'SubmissionService'
                    ]
                )

    // route and template definition
    .config(['$stateProvider', function($stateProvider) {
        
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'app/home/home.html?v=1.001',
                controller: 'HomeCtrl',
                resolve: {
                    'dayNumberQuery' : function($http, AppConfig) {
                        return $http.get(AppConfig.endpoints.dayNumber);
                    }
                },
                reload: true
            })
            .state('home.turn', {
                url: '/turn/:turnNumber',
                templateUrl: 'app/home/home.html?v=1.001',
                controller: 'HomeCtrl',
                resolve: {
                    'dayNumberQuery' : function($http, AppConfig) {
                        return $http.get(AppConfig.endpoints.dayNumber);
                    }
                },
                reload: true
            })
        ;        
    }])

    // controllers definition 
    .controller('HomeCtrl', [
                    '$window',
                    '$scope',
                    '$rootScope',
                    '$state',
                    '$timeout',
                    '$interval',
                    '$http',
                    '$filter',
                    '$uibModal',
                    '$auth',
                    'AppConfig',
                    'BusyAnimationService',
                    'OmnitureService',
                    'panzoomRaceMapService',
                    'raceMapService',
                    'Facebook',
                    'usSpinnerService',
                    'GAuth',
                    'SubmissionService',
                    'ShareService',
                    'BubblesService',
                    'dayNumberQuery',
        function(   $window,
                     $scope,
                     $rootScope,
                     $state,
                     $timeout,
                     $interval,
                     $http,
                     $filter,
                     $uibModal,
                     $auth,
                     AppConfig,
                     BusyAnimationService,
                     OmnitureService,
                     panzoomRaceMapService,
                     raceMapService,
                     Facebook,
                     usSpinnerService,
                     GAuth,
                     SubmissionService,
                     ShareService,
                     BubblesService,
                     dayNumberQuery
        ) {
            GAuth.setClient(window.indystar_environment.get('googleLoginClientId'));
            GAuth.setScope("https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.readonly"); // default scope is only https://www.googleapis.com/auth/userinfo.email



            /* debug */
            window.HomeCtrl         = $scope;
            
            /* data init */
            $scope.$state           = $state;
            $scope.AppConfig        = AppConfig;
            $scope.dayNumber        = dayNumberQuery.data.dayNumber;
            $scope.modalOpen        = false;
            
            /* controller init */
            $scope.BusyAnimationService = BusyAnimationService;
            $scope.auth                 = $auth;
            $scope.Facebook             = Facebook;
            $scope.GAuth                = GAuth;
            $scope.bubbles              = BubblesService.bubbles;
            
            /* home controller entry */
            $scope.main = function() {
                BusyAnimationService.stop();
                $scope.reportToOmniture();
                $scope.openUrlDrivenTurnModal();
            };
            


            /**
             * Omniture
             */
            $scope.omniture = {
                section : AppConfig.omniture.defaults.section,
                extension : 'algpi2-home-prod'
            };
            $scope.omnitureDelay = 1000; // ms
            $scope.reportToOmniture = function() {
                // console.log('reporting to omniture: ', $scope.omniture);
                $timeout(function() {
                    OmnitureService
                        .set('section',     $scope.omniture.section)
                        .set('extension',   $scope.omniture.extension)
                        .report()
                    ;                    
                }, $scope.omnitureDelay);
            };

            /**
             * Map Navigation
             */
            $scope.goToTurn = function(turnNumber) {
                panzoomRaceMapService.goToTurn(turnNumber);
            };
            $scope.raceMapApi = {};
            $scope.panzoomRaceMapApi = {};
            
            /**
             * Responsive Facebook Feed (width)
             */
            $scope.fbShowFeedWidth = 0;
            $scope.detectFbFeedWidth = function() {
                if ($window.innerWidth >= 1200) 
                        {return $scope.setFbFeedWidth(500);}
                if ($window.innerWidth >= 992) 
                        {return $scope.setFbFeedWidth(400);}
                if ($window.innerWidth >= 768) 
                        {return $scope.setFbFeedWidth(260);}
                if ($window.innerWidth >=  640) 
                        {return $scope.setFbFeedWidth(500);}
                if ($window.innerWidth >=  540) 
                        {return $scope.setFbFeedWidth(400);}
                if ($window.innerWidth >=  359) 
                        {return $scope.setFbFeedWidth(300);}
                if ($window.innerWidth < 359) 
                        {return $scope.setFbFeedWidth(260);}
            };
            $scope.setFbFeedWidth = function(number) {
                $timeout(function() {
                    $scope.fbShowFeedWidth = this.number;
                    // console.log('fbShowFeedWidth: ', $scope.fbShowFeedWidth);
                }.bind({number: number}));
            }
            angular.element($window).bind('resize', function() {
                // console.log('window width: ', $window.innerWidth);  
                $scope.detectFbFeedWidth();
            });
            $scope.detectFbFeedWidth();
            
            /**
             * Facebook loading animation
             */
            $scope.facebookLoading = true;
            $scope.startFacebookLoadingAnimation = function() {
                // console.log('start loading animation for facebook loading');
                $timeout(function() {
                    $scope.facebookLoading = true;
                    usSpinnerService.spin('facebook-loading');    
                }, 0);
            };
            $scope.stopFacebookLoadingAnimation = function() {
                $timeout(function() {
                    // console.log('hide loading animation for facebook loading');
                    $scope.facebookLoading = false;
                    usSpinnerService.stop('facebook-loading');
                }, 0);
            };
            $scope.fbFinishedRendering = function() {
                $scope.stopFacebookLoadingAnimation();
            }
            // attach event handlers after global facebook has loaded
            $scope.$watch(
                function() { return Facebook.isReady();}, 
                function(newVal) {
                    $scope.facebookReady = newVal;
                    if ($scope.facebookReady) {
                        FB.Event.subscribe('xfbml.render', $scope.fbFinishedRendering);
                    }
                }
            );
            $scope.startFacebookLoadingAnimation();

            /**
             * Twitter Loading animation
             */
            $scope.twitterLoading = true;
            $scope.startTwitterLoadingAnimation = function() {
                $timeout(function() {
                    $scope.twitterLoading = true;
                    usSpinnerService.spin('twitter-loading');    
                }, 0);
            };
            $scope.stopTwitterLoadingAnimation = function() {
                $timeout(function() {
                    $scope.twitterLoading = false;
                    usSpinnerService.stop('twitter-loading');    
                }, 0);
            };
            $scope.twitterFinishedRendering = function() {
                $scope.stopTwitterLoadingAnimation();
            };
            // attach event handlers after global twitter library has loaded
            
            $scope.whenTwitterLoaded = $interval(function() {
                if (typeof twttr != 'undefined') {
                    $interval.cancel($scope.whenTwitterLoaded);
                    $scope.doTwitter();
                } else { 
                    // console.log('twitter not ready yet'); 
                }
            }, 50);
            $scope.doTwitter = function() {
                // console.log('twitter ready, do stuff');
                twttr.ready(
                    function (twttr) {
                        // bind events here
                        twttr.events.bind(
                            'loaded',
                            function (event) {
                                event.widgets.forEach(function (widget) {
                                    // console.log("twitter widget loaded", widget);
                                    // console.log('twitter widget loaded id:', widget.id);
                                    $scope.twitterFinishedRendering();
                                });
                            }
                        );
                    }
                );
                twttr.widgets.load();
            };
            $scope.startTwitterLoadingAnimation();            
            
            
            /**
             * Authentication / Social Media Submission
             */
            $scope.authenticate = function(provider) {
                // (move logout to service when I get time)
                $http.get(AppConfig.endpoints.logout).then(function() {
                    $auth.authenticate(provider)
                        .then(function(response) {
                            //console.log('social media auth response: ', response);
                            $rootScope.$broadcast('auth:popup-closed');
                        })
                    ;
                });
            };
            $scope.$on('satellizer:popup:closed', function() {
                //console.log('satellizer:popup:closed');
                // $rootScope.$broadcast('auth:popup-closed');
            });
            $scope.$on('satellizer:popup:closed:normal', function() {
                //console.log('satellizer:popup:closed:normal');
                if (!$scope.$root.browserDetection.isIOS) {
                    $rootScope.$broadcast('auth:popup-closed');    
                }
            });
            $scope.$on('satellizer:popup:closed:error', function() {
                //console.log('satellizer:popup:closed:error');
                // $rootScope.$broadcast('auth:popup-closed');
            });
            $scope.$on('satellizer:popup:closed:success', function() {
                //console.log('satellizer:popup:closed:success');
                // $rootScope.$broadcast('auth:popup-closed');
            });
            $scope.$on('satellizer:popup:closed:nohash', function() {
                //console.log('satellizer:popup:closed:nohash');
                // $rootScope.$broadcast('auth:popup-closed');
            });
            $scope.$on('satellizer:popup:closed:domexception', function() {
                //console.log('satellizer:popup:closed:domexception');
                if ($scope.$root.browserDetection.isIOS) {
                    $rootScope.$broadcast('auth:popup-closed');
                }
            });

            
            /**
             * Post Auth checking and entry submission
             * (after the user login popup has closed)
             * (debounced)
             */
            $scope.canDoPostAuthStuff = true;
            $scope.canDoPostAuthStuffDebounceTimeout = 1000; // in ms
            $scope.doPostAuth = function() {
                if (!$scope.canDoPostAuthStuff) {return;}
                $scope.canDoPostAuthStuff = false;
                $timeout(function() {$scope.canDoPostAuthStuff = true}, $scope.canDoPostAuthStuffDebounceTimeout);
                // console.log('doing post auth stuff..');
                // check whoami
                SubmissionService.getWhoAmI()
                    .then(function(response) {
                        // console.log('whoami request succeeded (but with possible errors): ', response);
                        if (response.data.error !== undefined) {
                            // console.log('error: ', response.data.error);
                        } else {
                            // if I have a whoami, submit entry (no need to pull whoami, server is whoami-aware)
                            SubmissionService.submitSocial()
                                .then(function(response) {
                                    // console.log('submitted using social media auth, response: ', response);
                                    $rootScope.$broadcast('entry:submitted');
                                }, function(response) {
                                    // console.log('social media auth submission failed: ', response);
                                    $rootScope.$broadcast('entry:failed');
                                });
                        }
                    }, function(response) {
                        // console.log('whoami request failed.');
                    })
                ;
            };
            // takes some time before social media acknowledges new auth token
            $scope.doPostAuthDelay = 500; // in ms, 
            $scope.$on('auth:popup-closed', function() {
                $timeout(function() {
                    $scope.doPostAuth();     
                }, $scope.doPostAuthDelay);
            });
            
            
            
            /**
             * Form Submission
             */
            $scope.initializeFormFields = function() {
                $timeout(function() {
                    $scope.formData = {
                        first_name  : null,
                        last_name   : null,
                        email       : null,
                        phone       : null
                    };
                }, 0);
            };
            $scope.initializeFormFields();
            $scope.submitEntry = function() {
                SubmissionService.submitForm({
                    'formData'      : $scope.formData,
                    'formEndpoint'  : AppConfig.endpoints.entryForm
                })
                    .then(function(response) { // success
                        // console.log('entry form submitted successfully, response: ', response);
                        $rootScope.$broadcast('entry:submitted');
                    }, function(response) { // failure
                        // console.log('entry form submission failed, response: ', response);
                        $rootScope.$broadcast('entry:failed');
                    })
                ;
            };
            /**
             * Input Validation
             */
            $scope.submit = function(formName) {
                $timeout(function() {
                    $('#' + formName).submit();
                }, 0);
            };
            $scope.validateEntry = function(form) {
                if(form.validate($scope.entryFormValidationOptions)) {
                    // console.log('form data is valid');
                    $scope.submitEntry();
                } 
            };
            $scope.entryFormValidationOptions = {
                rules: {
                    first_name: {
                      required: true
                    },
                    last_name: {
                      required: true
                    },
                    email: {
                      required: true,
                      email:true
                    }
                },
                messages: {
                    email: {
                        required: "Please enter a valid email address so we can contact you.",
                        email: "Your email address must be in a valid format: name@domain.com"
                    },
                    first_name: {
                        required: "Please enter a first name.",
                    },
                    last_name: {
                        required: "Please enter a last name.",
                    }
                }
            };
            
            /**
             * After Entry Submission, Share Landing Page with Friends!
             */
            $scope.$on('entry:submitted', function() {
                // console.log('entry submitted, clearing form, showing share modal');
                $scope.initializeFormFields();
                $scope.openShareModal(); 
            });
            $scope.$on('entry:failed', function() {
                // console.log('entry submission failed'); 
            });
            
            /**
             * Sharing
             */
             $scope.defaultShareSettings = {
                facebookAppId : indystar_environment.get('shareSettings').facebookAppId,
                link        : indystar_environment.get('shareSettings').landingPageUrl,
                title       : 'Turn Up at the Angie\'s List Grand Prix of Indianapolis',
                tweet       : 'Get turn-by-turn detail and #UpClose features of the #GPofIndy @IMS on May 14',
                description : heredoc(function() {/*
                    Check out insider tips and a handy interactive map of the 14-turn Angie's 
                    List Grand Prix of Indianapolis coming to the Indianapolis Motor Speedway on May 14th. 
                    #GPofIndy
                */}),
                caption     : window.indystar_environment.get('shareSettings').caption,
                media       : window.indystar_environment.get('shareSettings').media,
                redirectUrl : window.indystar_environment.get('shareSettings').redirectUrl,
                emailSubject: 'Turn Up at the Angie\'s List Grand Prix of Indianapolis',
                emailBody   : heredoc(function() {/*
                    Check out insider tips and a handy interactive map of the 14-turn Angie's 
                    List Grand Prix of Indianapolis coming to the Indianapolis Motor Speedway on May 14th. 
                    #GPofIndy
                */}).trim().replace(/\s\s+/g, ' '),
            };
            $scope.defaultShareSettings.emailBody += '\n\n' + $scope.defaultShareSettings.link;
            $scope.shareSettings = {};
            $scope.initSharing = function(options) {
                if (options === undefined) {options = {};}
                $scope.shareSettings = angular.extend($scope.defaultShareSettings, options);
                ShareService.settings($scope.shareSettings);
            };
            $scope.initSharing(); 
            $scope.shareVia = function(network) {
                ShareService.share(network);
            };
            /**
             * Share Modal
             */
            $scope.openShareModal = function() {
                $scope.modalOpen = true;
                if ($scope.raceMapApi.hideAllBubbles) {
                    $scope.raceMapApi.hideAllBubbles();
                    // console.log('racemap api present');
                } else {
                    // console.log('no racemap api');
                }
                if ($scope.panzoomRaceMapApi.hideAllBubbles) {
                    $scope.panzoomRaceMapApi.hideAllBubbles();
                    // console.log('racemap api present');
                } else {
                    // console.log('no racemap api');
                }
                $scope.modalInstance = $uibModal.open({
                    animation: false,
                    templateUrl: 'app/home/share.modal.html',
                    controller: 'ShareModalCtrl',
                    size: 'md',
                    resolve: {
                        outterScope: function () {
                            return $scope;
                        }
                    }
                });
            };
            
            /**
             * Turn Modal
             */
            $scope.openTurnModal = function(turnNumber) {
                // console.log('opening modal for turnNumber: ', turnNumber);
                $scope.modalOpen = true;
                $scope.disableZoom();
                if ($scope.raceMapApi !== undefined
                 && $scope.raceMapApi.hideAllBubbles !== undefined
                ) {
                    $scope.raceMapApi.hideAllBubbles();
                }
                $scope.modalInstance = $uibModal.open({
                    animation: false,
                    templateUrl: 'app/home/turn.modal.html',
                    controller: 'TurnModalCtrl',
                    size: 'md',
                    resolve: {
                        data: function () {
                            var data = angular.extend({}, $scope.bubbles[turnNumber]);
                            return data;
                        },
                        outterScope: function() {
                            return $scope;
                        }
                    }
                });
                $scope.$root.$broadcast('modal:opened');
            };
            $scope.openUrlDrivenTurnModal = function() {
                // console.log('$state.params: ', $state.params);
                if ($state.params.turnNumber === undefined) {return;}
                var turnNumber = $scope.getBestDefaultTurnNumber();
                if (turnNumber !== null && turnNumber !== undefined) {
                    // console.log('opening modal on boot for turnNumber: ', turnNumber);
                    // otherwise, open the modal
                    AppConfig.showBubbleOnBoot = false;
                    if ($scope.raceMapApi.hideAllBubbles) {
                        $scope.raceMapApi.hideAllBubbles();
                    }
                    $scope.openTurnModal(turnNumber);
                }
            };
            $scope.getBestDefaultTurnNumber = function() {
                var turnNumber = null;
                if ($state.params.turnNumber !== undefined) {
                    turnNumber = parseInt($state.params.turnNumber, 10);
                }
                // if turn number is out of range
                if (turnNumber > AppConfig.bubbleRangeConstraints.max || turnNumber < AppConfig.bubbleRangeConstraints.min) {
                    // use day number
                    turnNumber = parseInt($scope.dayNumber, 10);
                } else {
                    return turnNumber;
                }
                // if turn number is still out of range
                if (turnNumber === undefined 
                     || turnNumber < AppConfig.bubbleRangeConstraints.min
                     || turnNumber > AppConfig.bubbleRangeConstraints.max
                    ) 
                { // no best guess at default turnNumber
                    return null;
                }
                return turnNumber;
            };
            $scope.openBestDefaultTurnBubble = function() {
                var turnNumber = $scope.getBestDefaultTurnNumber();
                // console.log('best bubble turn number: ', turnNumber);
                if (turnNumber !== null && turnNumber !== undefined) {
                    if ($scope.raceMapApi && $scope.isMobile) {
                        $scope.raceMapApi.showBubble(turnNumber);
                    }
                    if ($scope.panzoomRaceMapApi && !$scope.isMobile) {
                        $scope.panzoomRaceMapApi.showBubble(turnNumber);
                    }
                }
            };
            $scope.openTodayTurnBubble = function() {
                // console.log('opening today turn bubble');
                if ($scope.dayNumber === undefined
                 || $scope.dayNumber < AppConfig.bubbleRangeConstraints.min
                 || $scope.dayNumber > AppConfig.bubbleRangeConstraints.max
                ) { 
                    // console.log('invalid day number, HomeCtrl trying topen map bubbles')
                    return;
                }
                if (!$scope.isMobile && $scope.panzoomRaceMapApi) {
                    // console.log('trying to open panzoom racemap bubble for dayNumber: ', $scope.dayNumber);
                    $scope.panzoomRaceMapApi.showBubble($scope.dayNumber);
                }
                if ($scope.isMobile && $scope.raceMapApi) {
                    // console.log('trying to open racemap bubble for dayNumber: ', $scope.dayNumber);
                    $scope.raceMapApi.showBubble($scope.dayNumber);
                }
                
                
            }
            $scope.restoreBubbles = function() {
              if ($scope.isMobile) {
                    if ($scope.raceMapApi) {
                        if ($scope.raceMapApi.scope.showLastBubble) {
                            // $scope.raceMapApi.scope.showLastBubble();
                        }
                    } else {
                        if ($scope.showLastBubble) {
                            // $scope.showLastBubble();
                        }
                    }
                } else {
                    // console.log('modal closing, $scope: ', $scope);
                    if ($scope.panzoomMapApi !== undefined
                     && $scope.panzoomMapApi.scope.openInitialBubble !== undefined) {
                        if (!$scope.isMobile) {
                            $scope.panzoomMapApi.scope.openInitialBubble();
                        }
                    }
                    if ($scope.api !== undefined
                     && $scope.api.openInitialBubble !== undefined
                    ) {
                        if (!$scope.isMobile) {
                            $scope.api.openInitialBubble();
                        }
                    }
                }   
            };
            
            
            /**
             * Misc
             */
            $scope.toggleMobile = function(value)
            {
                // console.log('toggling mobile');
               if (value === undefined) {value = !$scope.isMobile;}
               $timeout(function() {
                   $scope.isMobile = value;
               });
            };
            $scope.toggleIpad = function(value)
            {
               if (value === undefined) {value = !$scope.isiPad;}
               $timeout(function() {
                   $scope.isiPad = value;
               });
            };
            // (see app.js, browserDetection defined on $rootScope)
            $scope.isMobile = $scope.browserDetection.isMobile;
            $scope.isiPad   = $scope.browserDetection.isiPad;
            // $scope.isMobile = true;
            // $scope.isiPad   = true;
         
            $scope.enableZoom = function() {
                zoomSwitch.enableZoom();
            };
            $scope.disableZoom = function() {
                zoomSwitch.disableZoom();
            };

            $scope.canEnableZooming = true;
            $scope.enableZooming = function(delay) {
                // never enable zooming for iPad
                if ($scope.browserDetection.isiPad) {
                    // console.log('device is ipad, not enabling zooming');
                    return;
                }
                $scope.enableZoomDelay = delay;
                $scope.canEnableZooming = true;
                $timeout(function() {
                    if ($scope.canEnableZooming) {
                        AppConfig.panzoomRaceMap.panZoomInit.zoomOnMouseWheel = true;
                    }
                },$scope.enableZoomDelay);
            };
            $scope.disableZooming = function(delay) {
                if ($scope.browserDetection.isiPad) {
                    // console.log('device is ipad, not disabling zooming');
                    return;
                }
                $scope.canEnableZooming = false;
                if ($scope.browserDetection.isiPad) {return;}
                $timeout(function() {
                    AppConfig.panzoomRaceMap.panZoomInit.zoomOnMouseWheel = false;
                    $timeout(function() {
                        $scope.canEnableZooming = true;
                    }, $scope.enableZoomDelay);
                    
                }, delay);
            }
            $scope.showMap = true;
            $scope.reloadMap = function(dayNumber) {
                if (dayNumber === undefined) {dayNumber = dayNumberQuery.data.dayNumber;}
                $scope.dayNumber = dayNumber;
                $timeout(function() {
                    $scope.showMap = false;
                }, 0).then(function() {
                    $timeout(function() {
                        $scope.showMap = true;
                    }, 0);
                })
            };
            $scope.hideAllBubbles = function() {
                if ($scope.raceMapApi !== undefined
                    && $scope.raceMapApi.hideAllBubbles !== undefined
                ) {
                    $scope.raceMapApi.hideAllBubbles();
                }  
                if ($scope.panzoomRaceMapApi !== undefined
                    && $scope.panzoomRaceMapApi.hideAllBubblesModal !== undefined
                ) {
                    $scope.panzoomRaceMapApi.hideAllBubblesModal();
                }  
            };

            
            $scope.breakpointChanges = 0;
            $scope.$on('breakpoint:changed', function(newVal) {
                // console.log('reloading map at screen width: ', window.innerWidth);
                // when page loads it counts as an initial breakpoint change
                if ($scope.breakpointChanges > 0 
                 && $scope.modalOpen
                ) {
                    $scope.reloadMap(); 
                }
                $scope.breakpointChanges++;
            });
           
            angular.element($window).bind('resize', function() {
                // console.log('window width: ', window.innerWidth);
                raceMapService.detectBreakpointChange();
            });
            $scope.$on('modal:opened', function() {
                console.log('HomeCtrl heard model:opened');
                $scope.modalOpen = true;
                $scope.hideAllBubbles();
            });
            
            $scope.$on('modal:closed', function() {
                $scope.modalOpen = false;
                $scope.restoreBubbles();
                if (!$scope.isMobile) {
                    $scope.reloadMap(dayNumberQuery.data.dayNumber); 
                }
            });
            angular.element($window).bind('orientationchange', function() {
                if( ($scope.isiPad || $scope.isMobile) ) {
                    if (!$scope.modalOpen) {
                        // console.log('orientation changed, isiPad or isMobile, modal is not open, reloading map with day');
                        $scope.reloadMap(dayNumberQuery.data.dayNumber); 
                    } else {
                        // console.log('orientation changes on mobile/ipad while modal is open, reloading map with null day')
                        $scope.reloadMap(null);
                        $timeout(function() {
                            $scope.hideAllBubbles();
                        }, 100);
                    }
                }
            });
            /**
             * Facebook Race Condition(?) .. if Facebook hasn't loaded after awhlie, try it again
             */
            $scope.reloadFacebook = function() {
                FB.init({
                    appId      : window.indystar_environment.get('shareSettings').facebookAppId,
                    status     : true,
                    xfbml      : true,
                    version    : 'v2.4' // or v2.0, v2.1, v2.2, v2.3
                  });
            };
            
            $scope.reloadFacebookAfterDelayDesktop = 3000;
            $scope.reloadFacebookAfterDelayMobile = 5000;
            if ($scope.isMobile) {
                $scope.reloadFacebookAfterDelay = $scope.reloadFacebookAfterDelayMobile;
            } else {
                $scope.reloadFacebookAfterDelay = $scope.reloadFacebookAfterDelayDesktop;
            }
            $timeout(function() {
                if ($scope.facebookLoading) {
                    $scope.reloadFacebook();
                }
            }, $scope.reloadFacebookAfterDelay);
            
            
            /**
             * Prize Modal
             */
            $scope.openPrizeModal = function() {
                // console.log('opening prize modal');
                $scope.modalInstance = $uibModal.open({
                    animation: false,
                    templateUrl: 'app/home/prize.modal.html',
                    controller: 'PrizeModalCtrl',
                    size: 'md',
                    resolve: {
                        outterScope: function() {
                            return $scope;
                        }
                    }
                });    

                
            };
            
            /**
             * Rules Modal
             */
            $scope.openRulesModal = function() {
                // console.log('opening rules modal');
                $scope.modalInstance = $uibModal.open({
                    animation: false,
                    templateUrl: 'app/home/rules.modal.html',
                    controller: 'RulesModalCtrl',
                    size: 'lg',
                    resolve: {
                        outterScope: function() {
                            return $scope;
                        }
                    }
                });    

                
            };

            
            
            
            /* kick it off */
            $scope.main();
            
        }]
    ) // end HomeCtrl
    
    .controller('ShareModalCtrl', [
        '$scope',
        '$uibModalInstance',
        'outterScope',
        function(
            $scope,
            $uibModalInstance,
            outterScope
        ) {
            $scope.outterScope  = outterScope;

            $scope.dismiss = function() {
                $uibModalInstance.dismiss();
                outterScope.modalOpen = false;
                outterScope.openTodayTurnBubble();
            };
        }
    ])
    .controller('TurnModalCtrl', [
        '$scope',
        '$uibModalInstance',
        '$timeout',
        'TurnShareService',
        'data',
        'outterScope',
        function(
            $scope,
            $uibModalInstance,
            $timeout,
            TurnShareService,
            data,
            outterScope
        ) {
            $scope.outterScope  = outterScope;
            $scope.data         = data;
            
            $scope.TurnShareService = TurnShareService;
            
            $scope.dismiss = function() {
                // console.log('modal closing..');
                window.zoomSwitch.enableZoom();
                $uibModalInstance.dismiss();
                outterScope.modalOpen = false;
                // console.log('show last bubble..? outterScope: ', outterScope);
                $scope.$root.$broadcast('modal:closed');
            };
            // console.log('modalOpening, outterScope: ', outterScope);
            $scope.$root.$broadcast('modal:opened');
            
        }
    ])    
    .controller('PrizeModalCtrl', [
        '$scope',
        '$uibModalInstance',
        'outterScope',
        function(
            $scope,
            $uibModalInstance,
            outterScope
        ) {
            $scope.outterScope  = outterScope;
            
            $scope.dismiss = function() {
                $scope.$root.$broadcast('modal:closed');
                $uibModalInstance.dismiss();
                outterScope.modalOpen = false;
            };
            
            $scope.$root.$broadcast('modal:opened');
        }
    ])
    .controller('RulesModalCtrl', [
        '$scope',
        '$uibModalInstance',
        'outterScope',
        function(
            $scope,
            $uibModalInstance,
            outterScope
        ) {
            $scope.outterScope  = outterScope;

            $scope.dismiss = function() {
                $scope.$root.$broadcast('modal:closed');
                $uibModalInstance.dismiss();
                outterScope.modalOpen = false;
            };
            
            $scope.$root.$broadcast('modal:opened');
        }
    ])
    
    
;