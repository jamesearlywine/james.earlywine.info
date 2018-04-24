/* globals angular, heredoc */

/* gets base path of directive, for relative references to images/templates/etc */
var scripts = document.getElementsByTagName('script');
var path    = scripts[scripts.length-1].src.split('?')[0];      // remove any ?query
window.angular_directive_raceMap_basepath
            = path.split('/').slice(0, -1).join('/')+'/';  // remove last filename part of path

window.angular_directive_raceMap_basepath = 'common/js/directives/race-map/';

/**
 *  Directive 
 */
angular.module('racemap', [
        'ngAnimate',
        'panzoom'
    ])
    .directive('raceMap', function() {
        return {
            restrict: 'E',
            templateUrl:  window.angular_directive_raceMap_basepath + 'race-map.html?v=1.2',
            scope: {
                backgroundImage : '=?',
                dayNumber       : '=?',
                api             : '=?'
            },
            transclude: true,
            controller: [
                '$scope',
                '$element',
                '$attrs',
                '$transclude',
                '$timeout',
                '$interval',
                '$state',
                '$window',
                '$uibModal',
                'AppConfig',
                'raceMapService',
                'PanZoomService',
                'BubblesService',
                'TurnShareService',
            function(
                $scope, 
                $element, 
                $attrs, 
                $transclude,
                $timeout,
                $interval,
                $state,
                $window,
                $uibModal,
                AppConfig,
                raceMapService,
                PanZoomService,
                BubblesService,
                TurnShareService
            ) 
            {
                // ** debug ** //
                window.raceMapCtrl = $scope;
                window.raceMapService = raceMapService;
                
                // ** init ** //
                $scope.AppConfig        = AppConfig;
                $scope.raceMapService   = raceMapService;
                $scope.PanZoomService   = PanZoomService;
                
                raceMapService.set('mapId', 'the-race-map');
                
                // for loading css from directive folder
                $scope.directiveBasepath = window.angular_directive_raceMap_basepath; 
                
                $scope.defaults = {
                    
                };
                
                $scope.isMobile = true;
                
                $scope.TurnShareService = TurnShareService;
                
                angular.extend($scope, 
                    angular.extend({}, $scope.defaults, $scope)
                );
                
                // controller entry
                $scope.main = function() {
                    $scope.openInitialBubble();    
                };
                
                /**
                 * Markers
                 */
                $scope.markerState = {
                    1 : {
                        'selected'  : false
                    },
                    2 : {
                        'selected'  : false
                    },
                    3 : {
                        'selected'  : false
                    },
                    4 : {
                        'selected'  : false
                    },
                    5 : {
                        'selected'  : false
                    },
                    6 : {
                        'selected'  : false
                    },
                    7 : {
                        'selected'  : false
                    },
                    8 : {
                        'selected'  : false
                    },
                    9 : {
                        'selected'  : false
                    },
                    10 : {
                        'selected'  : false
                    },
                    11 : {
                        'selected'  : false
                    },
                    12 : {
                        'selected'  : false
                    },
                    13 : {
                        'selected'  : false
                    },
                    14 : {
                        'selected'  : false
                    },
                    15 : {
                        'selected'  : false
                    },
                    16 : {
                        'selected'  : false
                    },
                    17 : {
                        'selected'  : false
                    },
                    18 : {
                        'selected'  : false
                    },
                    19 : {
                        'selected'  : false
                    },
                    20 : {
                        'selected'  : false
                    },
                    21 : {
                        'selected'  : false
                    }
                };
                
                $scope.selectMarker = function(markerNumber) {
                    if (markerNumber === undefined
                        && this.markerId !== undefined
                    ) { markerNumber = this.markerId; }
                    $timeout(function() {
                        $scope.unselectAllMarkers();
                        $scope.markerState[markerNumber].selected = true;        
                    }, 0);
                };
                $scope.unselectMarker = function(markerNumber) {
                    $scope.markerState[markerNumber].selected = false;
                };
                $scope.unselectAllMarkers = function() {
                    for (var key in $scope.markerState) {
                        $scope.unselectMarker(key);
                    }
                };
                $scope.hoverIn = function(markerNumber) {
                    if (markerNumber === undefined
                        && this.markerId !== undefined
                    ) { markerNumber = this.markerId; }
                    // console.log("hoverIn markerNumber", markerNumber);
                    $scope.hideAllBubbles();
                    $scope.selectMarker(markerNumber);
                    $scope.showBubble(markerNumber);
                };
                $scope.hoverOut = function(markerNumber) {
                    if (markerNumber === undefined
                        && this.markerId !== undefined
                    ) { markerNumber = this.markerId; }
                    // console.log("hoverOut markerNumber", markerNumber);
                    
                };
                
                /**
                 * Bubbles
                 */
                $scope.bubbles = [];
                $scope.initBubbles = function() {
                    BubblesService.init();
                    $scope.bubbles = BubblesService.bubbles;
                };
                $scope.initBubbles();
                $scope.showBubble = function(markerNumber) {
                    if (markerNumber === undefined) {return}
                    if ($scope.bubbles[markerNumber] == undefined) {
                        $timeout(function() {
                            // console.log('retrying to show bubble: ', this.markerNumber);
                            $scope.showBubble(this.markerNumber);
                        }.bind({markerNumber: markerNumber}), 100);   
                    } else {
                        $scope.lastBubbleNumber = markerNumber;
                        $timeout(function() {
                            $scope.bubbles[markerNumber].display = true;
                            $scope.currentBubble = $scope.bubbles[markerNumber];
                        }, 0);    
                    }
                };
                $scope.showLastBubble_disabled = function() {
                    if ($scope.lastBubbleNumber === undefined 
                     && $scope.dayNumber !== undefined
                     && $scope.dayNumber !== null
                    ) {
                        $scope.lastBubbleNumber = $scope.dayNumber;
                    }
                    $timeout(function() {
                        $scope.showBubble($scope.lastBubbleNumber);      
                    }, 0);
                };
                $scope.hideBubble = function(markerNumber) {
                    $timeout(function() {
                        $scope.bubbles[markerNumber].display = false;
                        $scope.currentBubble = null;
                    }, 0);
                };
                $scope.hideAllBubbles = function() {
                    console.log('bubbles before: ', $scope.bubbles);
                    for (var key in $scope.bubbles) {
                        $scope.hideBubble($scope.bubbles[key].turnNumber);
                    }
                    console.log('bubbles after: ', $scope.bubbles);
                };
                $scope.currentBubble = null;
                
                $scope.openInitialBubble = function() {
                    console.log('race-map showing initial bubble..');
                    if ($scope.dayNumber !== undefined
                     && $scope.dayNumber !== null
                    ) {
                        $scope.selectMarker($scope.dayNumber);
                        if (AppConfig.showBubbleOnBoot) {
                            $scope.showBubble($scope.dayNumber);
                        }
                    }
                };

                /**
                 * Modal
                 */
                $scope.openMarkerModal = function(markerNumber) {
                    
                    window.zoomSwitch.disableZoom();
                    if (markerNumber === undefined
                        && this.markerId !== undefined
                    ) { markerNumber = this.markerId; }
                    $scope.currentBubble = $scope.bubbles[markerNumber];
                    console.log('opening modal for markerNumber: ', markerNumber);
                        $scope.modalInstance = $uibModal.open({
                            animation: false,
                            templateUrl: 'app/home/turn.modal.html',
                            controller: 'TurnModalCtrl',
                            size: 'md',
                            resolve: {
                                data: function () {
                                    var data = angular.extend({}, $scope.currentBubble);
                                    return data;
                                },
                                outterScope: function() {
                                    return $scope;
                                }
                            }
                        })
                    ;
                    
                };
                
                /**
                 * Decorate any external api access with internal api access
                 */
                $scope.decorateExternalApiObject = function() {
                    if ($scope.api) {
                        $scope.api.hideAllBubbles = function() {
                            $scope.hideAllBubbles();
                        }
                        $scope.api.showBubble = function(markerNumber) {
                            console.log('showing bubble markerNumber: ', markerNumber);
                            $scope.showBubble(markerNumber);
                        }
                        $scope.api.scope = $scope;
                    }
                };
                $scope.decorateExternalApiObject();

                $scope.globalState = window.globalState;
                $scope.$on('modal:opened', function() {
                    $scope.globalState.modalHasOpened = true;
                    $timeout(function() {
                        $scope.modalOpen = true;
                    }, 0);
                });
                
                $scope.$on('modal:closed', function() {
                    $timeout(function() {
                        $scope.modalOpen = false;
                    }, 0);
                });


                // ** kick it off..
                $scope.main();
                
            }]
        };
    })
    .factory('raceMapService', [
        '$q',
        '$http',
        '$rootScope',
        'AppConfig',
        'PanZoomService',
        function(
            $q,
            $http,
            $rootScope,
            AppConfig,
            PanZoomService
        )
        {
            return {
                
                _state : {
                    mapId: null
                },
                get : function(key) {
                    return this._state[key];
                },
                set : function(key, value) {
                    this._state[key] = value;
                    return this;
                },
                goToTurn : function(turnNumber) {
                    if (turnNumber === undefined) {return}
                    // console.log('going to turn: ',  turnNumber);
                    var location = AppConfig.racemap.turnLocations[turnNumber];
                    // console.log('getting location: ', location);
                    var panZoomDestination = AppConfig
                                                .racemap
                                                .panZoomStates[location][this.getBreakpoint()]
                                                .zoomToFitParams
                    ;
                    PanZoomService.getAPI( this.get('mapId') ).then(
                        function(api) {
                            // console.log('panZoomDestination: ', this.panZoomDestination);
                            api.zoomToFit(this.panZoomDestination);
                        }.bind({panZoomDestination: panZoomDestination}) 
                    );
                },
                getApi : function() {
                    PanZoomService.getAPI( this.get('mapId') ).then(
                        function(api) {
                            // console.log('panZoomDestination: ', this.panZoomDestination);
                            window.raceMapApi = api;
                        } 
                    );
                },
                getBreakpoint : function() {
                    for (var i in AppConfig.panzoomRaceMap.breakpoints) {
                        var next = parseInt(i, 10) + 1;
                        if (    window.innerWidth > AppConfig.panzoomRaceMap.breakpoints[i] 
                            &&  window.innerWidth < AppConfig.panzoomRaceMap.breakpoints[next]
                        ) { 
                            return AppConfig.panzoomRaceMap.breakpoints[i]; 
                        }
                    }
                    return AppConfig.panzoomRaceMap.breakpoints[AppConfig.panzoomRaceMap.breakpoints.length - 1];
                },
                previousBreakpoint : null,
                detectBreakpointChange : function() {
                    var breakpoint = this.getBreakpoint();
                    if (this.previousBreakpoint !== breakpoint) {
                        $rootScope.$broadcast('breakpoint:changed');
                    }
                    this.previousBreakpoint = breakpoint;
                }

            } // end return 
            
        } // end function()
        
    ]) // end service()

;
    
    