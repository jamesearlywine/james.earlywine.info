/* globals angular, $, heredoc */

/* gets base path of directive, for relative references to images/templates/etc */
var scripts = document.getElementsByTagName('script');
var path    = scripts[scripts.length-1].src.split('?')[0];      // remove any ?query
window.angular_directive_ipadRaceMap_basepath
            = path.split('/').slice(0, -1).join('/')+'/';  // remove last filename part of path

window.angular_directive_ipadRaceMap_basepath = 'common/js/directives/ipad-race-map/';

/**
 *  Directive 
 */
angular.module('ipadRaceMap', [
        'ngAnimate'
    ])
    .directive('ipadRaceMap', function() {
        return {
            restrict: 'E',
            templateUrl:  window.angular_directive_ipadRaceMap_basepath + 'ipad-race-map.html?v=1.2',
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
                '$sce',
                '$window',
                '$uibModal',
                'AppConfig',
                'ipadRaceMapService',
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
                $sce,
                $window,
                $uibModal,
                AppConfig,
                ipadRaceMapService,
                BubblesService,
                TurnShareService
            ) 
            {
                // ** debug ** //
                window.ipadRaceMapCtrl = $scope;
                window.ipadRaceMapService = ipadRaceMapService;
                
                // ** init ** //
                $scope.AppConfig        = AppConfig;
                $scope.ipadRaceMapService   = ipadRaceMapService;

                ipadRaceMapService.set('mapId', 'the-ipad-race-map');
                
                // for loading css from directive folder
                $scope.directiveBasepath = window.angular_directive_ipadRaceMap_basepath; 
                
                $scope.defaults = {
                    
                };
                
                $scope.TurnShareService = TurnShareService;
                
                
                $scope.$sce = $sce;
                
                $scope.isiPad = $scope.$root.browserDetection.isiPad;
                
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
                    15: {
                        'selected'  : false
                    },
                    16: {
                        'selected'  : false
                    },
                    17: {
                        'selected'  : false
                    },
                    18: {
                        'selected'  : false
                    },
                    19: {
                        'selected'  : false
                    },
                    20: {
                        'selected'  : false
                    },
                    21: {
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
                    $scope.ipadRaceMapService.hideQueue.removeItem(markerNumber);
                    $scope.selectMarker(markerNumber);
                    if ($scope.$root.browserDetection.isiPad) {
                        return $scope.openMarkerModal(markerNumber);
                    }
                    
                    // console.log("hoverIn markerNumber", markerNumber);
                    if (
                        $scope.currentBubble !== null
                        && markerNumber != $scope.currentBubble.turnNumber) {
                        $scope.hideAllBubbles();
                        $scope.showBubble(markerNumber);
                    } else if ($scope.currentBubble === null) {
                        $scope.showBubble(markerNumber);
                    }
                };
                $scope.hoverOut = function(markerNumber) {
                    if (markerNumber === undefined
                        && this.markerId !== undefined
                    ) { markerNumber = this.markerId; }
                    // console.log("hoverOut markerNumber", markerNumber);
                    $scope.delayedHideBubble(markerNumber);
                    $scope.markerState[markerNumber].selected = false;
                };
                
               

                /**
                 * Bubbles
                 */
                $scope.bubbles = [];
                $scope.initBubbles = function() {
                    // console.log('initializing bubbles');
                    BubblesService.init();
                    $scope.bubbles = BubblesService.bubbles;
                    $scope.currentBubble = null;
                };
                $scope.initBubbles();
                $scope.showBubble = function(markerNumber) {
                    // console.log('show bubble: ', markerNumber);
                    $scope.ipadRaceMapService.hideQueue.removeItem(markerNumber);
                    if ($scope.bubbles[markerNumber] === undefined) {
                        $timeout(function() {
                            $scope.showBubble(this.markerNumber);    
                        }.bind({markerNumber: markerNumber}), 100)
                    } else {
                        $timeout(function() {
                            $scope.bubbles[markerNumber].display = true;
                            $scope.currentBubble = $scope.bubbles[markerNumber];
                        }, 0);            
                    }
                    
                };
                $scope.hideBubble = function(markerNumber) {
                    $scope.ipadRaceMapService.hideQueue.removeItem(markerNumber);
                    if ($scope.currentBubble !== null
                     && $scope.currentBubble.turnNumber == markerNumber) 
                    {
                        $scope.currentBubble = null;
                    }
                    $timeout(function() {
                        $scope.bubbles[markerNumber].display = false;
                    }, 0);
                };
                $scope.hideCurrentBubble = function(delay) {
                    if ($scope.currentBubble !== null) {
                        if (delay === undefined) {delay = 0;}
                        $scope.delayedHideBubble($scope.currentBubble.turnNumber, delay);      
                    }
                };
                $scope.hideAllBubbles = function() {
                    for (var key in $scope.bubbles) {
                        $scope.hideBubble($scope.bubbles[key].turnNumber);
                    }
                };
                $scope.defaultHideDelay = 500; // in ms
                $scope.delayedHideBubble = function(markerNumber, delay) {
                    if (delay === undefined) {delay = $scope.defaultHideDelay;}
                    ipadRaceMapService.hideQueue.addItem(markerNumber);
                    $timeout(function() {
                        if ($scope.ipadRaceMapService.hideQueue.hasItem(markerNumber)) {
                            $scope.hideBubble(this.markerNumber);
                        }
                    }.bind({markerNumber: markerNumber}), delay);
                    // console.log('hideQueue: ', ipadRaceMapService.hideQueue);
                };
                $scope.bubbleEnter = function(markerNumber) {
                    // console.log('mouseenter bubble for markerNumber: ', markerNumber);
                    $scope.showBubble(markerNumber);
                };
                $scope.bubbleLeave = function(markerNumber) {
                    // console.log('mouseleave bubble for markerNumber: ', markerNumber);
                    $scope.delayedHideBubble(markerNumber);
                };
                $scope.openInitialBubble = function() {
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
                    $timeout(function() {
                        $scope.hideAllBubbles();
                    }, 0).then(function() {
                        $scope.markerState[markerNumber].selected = false;
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
                    });
                    
                    
                };
                
                /**
                 * Decorate any external api access with internal api access
                 */
                $scope.decorateExternalApiObject = function() {
                    if ($scope.api) {
                        $scope.api.hideAllBubbles = function() {
                            $scope.hideAllBubbles();
                        };
                        $scope.api.showBubble = function(turnNumber) {
                            $scope.showBubble(turnNumber);
                        };
                        $scope.api.openInitialBubble = function() {
                            $scope.openInitialBubble();
                        };
                    }
                };
                $scope.decorateExternalApiObject();

                $scope.$on('modal:opened', function() {
                    $scope.modalOpen = true;
                });
                
                $scope.$on('modal:closed', function() {
                    $scope.modalOpen = false;
                });
                angular.element($window).bind('orientationchange', function() {
                    if ($scope.modalOpen) {
                        $scope.hideAllBubbles();
                    } 
                });


                //console.log('ipadRaceMapCtrl initialized');


                // ** kick it off..
                $scope.main();
                
            }]
        };
    })
    .factory('ipadRaceMapService', [
        '$q',
        '$http',
        '$rootScope',
        'AppConfig',
        function(
            $q,
            $http,
            $rootScope,
            AppConfig
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
                hideQueue : {
                    queue : [],
                    addItem : function(item) {
                        this.queue.push(item);
                    },
                    removeItem : function(item) {
                        for (var key in this.queue) {
                            if (this.queue[key] == item) {
                                this.queue.splice(key, 1);
                            }
                        }
                    },
                    hasItem : function(item) {
                        for (var key in this.queue) {
                            if (this.queue[key] == item) {
                                return true;
                            }
                        }
                        return false;
                    }
                }

                

            } // end return 
            
        } // end function()
        
    ]) // end service()

;
    
    