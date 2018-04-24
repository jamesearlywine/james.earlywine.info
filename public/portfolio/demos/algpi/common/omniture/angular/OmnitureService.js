/* global angular, $ */
/**
 * @brief Angular service wrapper for global indystar_omniture_tracking services 
 * @note  service written entirely in vanilla javascript (jquery dependency)
 */
angular.module('OmnitureService', [])
  .factory('OmnitureService', 
    [
        // injectables
      function(
        // injections
      )
      {
        return {
          settings : {
              iframeTransportId : 'omnitureTrackingiFrameTranpsort',
              baseEndpoint      : null, // 'common/html/omniture/transport.html'
              section           : null, // 'sponsored-content'
              extension         : null, // 'project-name'
              showDevice        : false,
              debugTransport    : false,
              _url              : null, 
              _iFrameElement    : null
          },
          config: function(options) {
            for (var key in options) {
              var value = options[key];
              this.setting(key, value);
            }
            return this;
          },
          setting : function(key, value) {
              if (value === undefined) {return this.settings[key];}
              if (value !== undefined) {
                  this.settings[key] = value;
                  return this;
              }
              return this.settings[key];
          },
          set: function(key, value) {
            return this.setting(key, value);
          },
          report : function(options) {
            
              // update options if any were passed
              if (options === undefined) {options = {};}
              this.config(options);
              
              // build the new iframe url
              this._buildURL();
              
              // console.log('remove any existing iframe');
              $( '#' + this.setting('iframeTransportId') ).remove();
              
              // console.log('build and append new iframe);
              this.setting( '_iFrameElement', $('<iframe />') );
              $( this.setting('_iFrameElement') )
                .css({
                  'width': '0px',
                  'height': '0px',
                  'visibility' : 'hidden'
                })
                .attr( 'id', this.setting('iframeTransportId') )
                .appendTo( 'body' )
                .attr( 'src', this.setting('_url') )
              ;
              
          },
          _buildURL : function() {
              this.setting('_url', 
                this.settings.baseEndpoint 
                + '?section='         + encodeURIComponent(this.settings.section)
                + '&extension='       + encodeURIComponent(this.settings.extension)
                + '&showDevice='      + encodeURIComponent(this.settings.showDevice)
                + '&debugTransport='  + encodeURIComponent(this.settings.debugTransport)
              );
              return this;
          }
          
            
            
        }; // end return
      } // end function
    ]
  ) // end factory
; // end module