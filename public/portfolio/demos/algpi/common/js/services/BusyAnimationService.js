angular.module('BusyAnimationService', [])
    .factory('BusyAnimationService', [
        'lodash',
        'usSpinnerService',
        'AppConfig',
        function(
            lodash,
            usSpinnerService,
            AppConfig
        )
        {
            window.usSpinnerService = usSpinnerService;
            
            return {
                
                defaultDebounceDelay    : AppConfig.busyAnimationDebounceDelay,
                debounceDelay           : AppConfig.busyAnimationDebounceDelay,
                shouldSpin      : false,
                spinnerService  : usSpinnerService,
                busyMessage     : null,
                
                // fluent setter for message to display with busy animation
                withBusyMessage : function(text) {
                    this.busyMessage = text;
                    return this;
                },
                
                _doStart        : function() {
                    // console.log('BusyAnimationService._doStart() called.  this.shouldSpin: ', this.shouldSpin);
                    if (this.shouldSpin === true) {
                        this.spinnerService.spin('busy');
                        this.shouldSpin = false;
                    }
                }, 
                start : function(debounceDelay) {
                    if (debounceDelay !== undefined) {
                        this.debounceDelay = debounceDelay;
                    }
                    this.shouldSpin = true;
                    this._doStartDebounced = lodash.debounce(
                        this._doStart.bind(this),
                        this.debounceDelay,
                        false
                    );
                    this._doStartDebounced();
                },
                stop : function() {
                    this.shouldSpin = false; // debounced code should not execute
                    this.busyMessage = null;  // reset busy message to null
                    this.debounceDelay = this.defaultDebounceDelay;
                    this.spinnerService.stop('busy');
                },
                
                

            } // end return 
            
        } // end function()
        
    ]) // end service()
    
; // end angular.module()