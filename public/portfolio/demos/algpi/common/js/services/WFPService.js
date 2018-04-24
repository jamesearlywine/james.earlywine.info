/* globals angular, $ */

/**
 * History Service 
 */
 angular.module('WFPService', [])
    .factory('WFPService', [
        '$window',
        function(
            $window
        )
        {
            /**
             * All references to elements are instances of jquery-wrapped elements
             */
            var api = {
                defaults : {
                    sentinelElement : null,
                    sentinelProperties : {
                        x: null, // left
                        y: null, // top
                        width: null,
                        height: null
                    },
                    sentinelFreeSpace : {
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        elements : {
                            top: null,
                            left: null,
                            right: null,
                            bottom: null,
                            css : {
                                border: 'purple solid 2px'
                            }
                            
                        }
                    },
                    placement : {
                        element : null,
                        options : {
                            topOffset: 0,
                            leftOffset: 0,
                            rightOffset: 0,
                            bottomOffset: 0
                        },
                        defaultOptions : {
                            topOffset: 0,
                            leftOffset: 0,
                            rightOffset: 0,
                            bottomOffset: 0
                        }
                    }
                },
                settings : {
                    
                },
                set : function(key, value) {
                    this.settings[key] = value;
                    if (key == 'sentinelElement') {
                        this.calculateSentinelProperties();
                    }
                    return this;
                },
                get : function(key) {
                    return this.settings[key];
                },
                config : function(settings) {
                    if (settings === undefined) {settings = {};}
                    this.settings = angular.extend(this.defaults, settings);
                    return this;
                },
                reset : function() {
                    this.config({});
                },
                getSpaceInfoForElement : function(element) {
                    return this.getSpaceInfoFor({
                        width   : element.width(),
                        height  : element.height()
                    });
                },
                getSpaceInfoFor : function(options) {
                    options.width   = options.width     || 0;
                    options.height  = options.height    || 0;
                    
                    this.getFreeSpaceAroundSentinel();
                    
                },
                showSentinelSpace : function() {
                    this.calculateSentinelProperties();
                    this.settings.sentinelMockElement = $("<div class='screen-fixed-positioning-service-sentinel-mock'></div<");
                    this.settings.sentinelMockElement.css({
                        'position'  : 'fixed',
                        'display'   : 'block',
                        'background-color'  : 'red',
                        'top'       : this.settings.sentinelProperties.y,
                        'left'      : this.settings.sentinelProperties.x,
                        'width'     : this.settings.sentinelProperties.width,
                        'height'    : this.settings.sentinelProperties.height
                    });
                    $('body').append(this.settings.sentinelMockElement);
                },
                hideSentinelSpace : function() {
                    this.settings.sentinelMockElement.remove();
                },
                hideAllSentinelSpace : function() {
                    $('.screen-fixed-positioning-service-sentinel-mock').remove();
                },
                updateSentinelSpace : function() {
                    console.log('updating sentinel space');
                    this.hideSentinelSpace();
                    this.calculateSentinelProperties();
                    this.showSentinelSpace();
                    this.showFreeSpaceAroundSentinel();
                },
                followSentinelSpace : function() {
                    this.fn = this.updateSentinelSpace.bind(this);
                    angular.element($window).bind('scroll resize', this.fn);  
                },
                unFollowSentinelSpace : function() {
                    angular.element($window).unbind('scroll resize', this.fn);  
                },
                
                calculateSentinelProperties : function() {
                    if (this.get('sentinelElement') !== null) {
                        this.set('sentinelProperties', 
                            this.getElementWindowPosition(
                                this.get('sentinelElement')
                            )
                        );
                    }    
                },
                
                /**
                 * Get free space around sentinel object
                 */
                getFreeSpaceAroundSentinel : function() {
                    this.calculateSentinelProperties()
                    
                    this.settings.sentinelFreeSpace.top 
                        = this.settings.sentinelProperties.y;
                    this.settings.sentinelFreeSpace.left
                        = this.settings.sentinelProperties.x;
                    this.settings.sentinelFreeSpace.bottom
                        = $window.innerHeight 
                            - (   this.settings.sentinelProperties.y 
                                + this.settings.sentinelProperties.height
                              )
                    ;
                    this.settings.sentinelFreeSpace.right
                        = $window.innerWidth
                            - (   this.settings.sentinelProperties.x
                                + this.settings.sentinelProperties.width
                              )
                    ;
                    
                    return this.settings.sentinelFreeSpace;
                },
                showFreeSpaceAroundSentinel : function() {
                    
                    this.getFreeSpaceAroundSentinel();
                    this.removeFreeSpaceAroundSentinel();
                    
                    this.settings.sentinelFreeSpace.elements.top = 
                        $("<div class='screen-fixed-positioning-service-sentinel-freespace "
                         + "screen-fixed-positioning-service-sentinel-freespace-top'></div>")
                    ;
                    this.settings.sentinelFreeSpace.elements.left = 
                        $("<div class='screen-fixed-positioning-service-sentinel-freespace "
                         + "screen-fixed-positioning-service-sentinel-freespace-left'></div>")
                    ;
                    this.settings.sentinelFreeSpace.elements.right = 
                        $("<div class='screen-fixed-positioning-service-sentinel-freespace "
                         + "screen-fixed-positioning-service-sentinel-freespace-right'></div>")
                    ;
                    this.settings.sentinelFreeSpace.elements.bottom = 
                        $("<div class='screen-fixed-positioning-service-sentinel-freespace "
                         + "screen-fixed-positioning-service-sentinel-freespace-bottom'></div>")
                    ;
                    
                    this.settings.sentinelFreeSpace.elements.top.css({
                        'top'           : 0,
                        'left'          : 0,
                        'width'         : $window.innerWidth,
                        'height'        : this.settings.sentinelFreeSpace.top,
                        'border'        : this.settings.sentinelFreeSpace.elements.css.border,
                        'position'      : 'fixed',
                        'visibility'    : 'visible'
                    });
                    this.settings.sentinelFreeSpace.elements.left.css({
                        'top'       : 0,
                        'left'      : 0,
                        'width'     : this.settings.sentinelFreeSpace.left,
                        'height'    : $window.innerHeight,
                        'border'        : this.settings.sentinelFreeSpace.elements.css.border,
                        'position'      : 'fixed',
                        'visibility'    : 'visible'
                    });
                    this.settings.sentinelFreeSpace.elements.bottom.css({
                        'top'       : this.settings.sentinelProperties.y + this.settings.sentinelProperties.height,
                        'left'      : 0,
                        'width'     : $window.innerWidth,
                        'height'    : this.settings.sentinelFreeSpace.bottom,
                        'border'        : this.settings.sentinelFreeSpace.elements.css.border,
                        'position'      : 'fixed',
                        'visibility'    : 'visible'
                    });
                    this.settings.sentinelFreeSpace.elements.right.css({
                        'top'       : 0,
                        'left'      : this.settings.sentinelProperties.x + this.settings.sentinelProperties.width,
                        'width'     : this.settings.sentinelFreeSpace.right,
                        'height'    : $window.innerHeight,
                        'border'        : this.settings.sentinelFreeSpace.elements.css.border,
                        'position'      : 'fixed',
                        'visibility'    : 'visible'
                    });
                    
                    $('body').append([
                        this.settings.sentinelFreeSpace.elements.top,
                        this.settings.sentinelFreeSpace.elements.left,
                        this.settings.sentinelFreeSpace.elements.right,
                        this.settings.sentinelFreeSpace.elements.bottom
                    ]);
                    
                     
                },
                removeFreeSpaceAroundSentinel : function() {
                    $('.screen-fixed-positioning-service-sentinel-freespace').remove();
                },
                
                /**
                 * Place Element somewhere relative to sentinel
                 */
                placeElement : function(element, options) {
                    if (element !== undefined) {
                        this.settings.placement.element = element;    
                    }
                    if (options !== undefined) {options = {};}
                    this.settings.placement.options = 
                        angular.extend(this.settings.placement.defaultOptions, options)
                    ;
                    var freeSpaces = [
                        {label: 'top',      space: this.settings.sentinelFreeSpace.top},
                        {label: 'left',     space: this.settings.sentinelFreeSpace.left},
                        {label: 'bottom',   space: this.settings.sentinelFreeSpace.bottom},
                        {label: 'right',    space: this.settings.sentinelFreeSpace.right},
                    ];
                    // sort by which space has the largest distance to the edge of the window first
                    freeSpaces.sort(function(a, b) {
                        return b.space - a.space;
                    });
                    
                    for (var key in freeSpaces) {
                        freeSpaces[key].elementCanFit = this.freeSpaceCheckElement(freeSpaces[key], this.settings.placement.element);
                        freeSpaces[key].elementWidth  = this.settings.placement.element.width();
                        freeSpaces[key].elementHeight = this.settings.placement.element.height();
                        freeSpaces[key].windowWidth   = $window.innerWidth;
                        freeSpaces[key].windowHeight  = $window.innerHeight;
                        
                    }
                    console.log('freeSpaces: ', freeSpaces);
                    
                    
                      
                },
                
                freeSpaceCheckElement : function(freeSpace, element) {
                    if (freeSpace.label == 'top' || freeSpace.label == 'bottom') {
                        // console.log('top or bottom');
                        return (     element.width() < $window.innerWidth
                                 &&  element.height() < freeSpace.space    )
                    }
                    if (freeSpace.label == 'left' || freeSpace.label == 'right') {
                        // console.log('left or right');
                        return (    element.width() < freeSpace.space
                                 &&  element.height() < $window.innerHeight )
                    }
                    // console.log('not top, left, bottom, or right');
                    return false;
                },
                
                
                
                
                /**
                 * Gets element position relative to window
                 */
                getElementWindowPosition : function(element) {
                    var top     = element.offset().top - $(window).scrollTop();
                    var left    = $(element).offset().left - $(window).scrollLeft();
                    var height  = element.height();
                    var width   = element.width();
                    return {x: left, y: top, width: width, height: height};
                },
                /**
                 * Gets element center position relative to window
                 */
                getElementCenterWindowPosition : function(element) {
                    var top     = element.offset().top - $(window).scrollTop();
                    var left    = $(element).position().left - $(window).scrollLeft();
                    var height  = element.height();
                    var width   = element.width();
                    var center  = {
                            x   : top + ( height / 2),
                            y   : left + ( width  / 2)
                    };
                    return {x: center.x, y: center.y, width: width, height: height};
                }
                
                
            }; // end var api
            api.config(); // initialize as empty config to use default values
            return api;
            
        }
    ])
;
        