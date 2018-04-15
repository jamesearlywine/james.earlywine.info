'use strict';

/**
 *  @brief    Omniture Reporting Service
 *  @author   james.earlywine@indystar.com
 *  @date     November 14th 2016
 *  @note     Uses a dynamically-generated iframe transport containing the standard static code
 *            - (see omniture/transport.html)
 */

/* gets base path of script, for storing the path to the iframe transport html file */
var scripts = document.getElementsByTagName('script');
var path    = scripts[scripts.length-1].src.split('?')[0];      // remove any ?query
window.indystar_omniture_reporting_basepath
            = path.split('/').slice(0, -1).join('/')+'/';  // remove last filename part of path


window.indystar_omniture_reporting = 
{
  // default values
  settings : {
    iframeTransportId : 'omnitureTrackingiFrameTranpsort',
    baseEndpoint      : window.indystar_omniture_reporting_basepath + 'transport.html', 
    path              : null,
    section           : null, // legacy api support
    extension         : null, // legacy api support
    showDevice        : true,
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
  set : function(key, value) { // legacy api support
    return this.setting(key, value);
  },
  report : function(options) {
    
    // update options if any were passed
    if (options === undefined) {options = {};}
    this.config(options);

    /* legacy api support */
    if (options.path === undefined) {
      if (this.settings.section !== null && this.settings.extension !== null) {
        this.settings.path = '/story/' + this.settings.section + '/' + this.settings.extension;
      }
    }
    
    // build the new iframe url
    this._buildURL();
    
    // console.log('remove any existing iframe');
    if (this.setting('_iFrameElement')) {
      this.setting('_iFrameElement').parentNode.removeChild(this.setting('_iFrameElement'));
    }

    // console.log('build and append new iframe);
    this.setting('_iFrameElement', document.createElement('iframe') );
    this.setting('_iFrameElement').style.width      = '0px';
    this.setting('_iFrameElement').style.height     = '0px';
    this.setting('_iFrameElement').style.visibility = 'hidden';
    this.setting('_iFrameElement').setAttribute('id', this.setting('iframeTransportId'));
    document.body.appendChild(this.setting('_iFrameElement'));
    this.setting('_iFrameElement').setAttribute('src', this.setting('_url'));

  },
  _buildURL : function() {
    this.setting('_url', 
      this.settings.baseEndpoint 
      + '?path='            + encodeURIComponent(this.settings.path)
      + '&showDevice='      + encodeURIComponent(this.settings.showDevice)
      + '&debugTransport='  + encodeURIComponent(this.settings.debugTransport)
      
    );
    return this.setting('_url');
  }
  

};