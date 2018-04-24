window.indystar_environment = {

    /**
     * Environmental Variables - returned by get(), depending on environment state
     */
    variables : {
        'dev' : {
            showOnscreenLogger : window.isiPad ? true : false,
            baseURL: '//james.earlywine.info/portfolio/demos/algpi',
            assetsBaseURL: '',
            shareSettings : {
                facebookAppId: '',
                caption: '',
                media: '',
                redirectUrl: '',
                landingPageUrl: ''
            },
            googleLoginClientId: '',
            omniture : {
                defaults : {
                    section: 'sponsor-story/algpi-dev',
                    extension: null,
                    showDevice: true,
                    debugTransport: true
                }
            },
            googleAnalyticsCode: ''
        },
        'production' : {
            showOnscreenLogger : false,
            baseURL: '//digital.indystar.com/algpi2',
            assetsBaseURL: '',
            shareSettings : {
                facebookAppId: '',
                caption: '',
                media: '',
                redirectUrl: '',
                landingPageUrl: ''
            },
            googleLoginClientId: '',
            omniture : {
                defaults : {
                    section: 'sponsor-story/algpi',
                    extension: null,
                    showDevice: true,
                    debugTransport: false
                }
            },
            googleAnalyticsCode: ''
        }

    },

    /**
     * Environment URL Config
     */
    environmentURLs: {
        // environment
        'dev': [
            // urls that trigger that environment state
            'earlywine.info'
        ]
    },
    defaults: {
        // if no url matches, this is the environment state to trigger..
        'environment': 'production'
    },

    /**
     *  Getters / Setters
     */
    get: function(key, defaultValue) {
        if (key ===undefined) {
            return this.variables[this.environment];
        }
        if (this.variables[this.environment][key] === undefined) {
            if (defaultValue !== undefined) {
                return defaultValue;
            } else {
                return undefined;
            }
        } else {
            return this.variables[this.environment][key];
        }
    },
    set: function(key, value) {
        return this.variables[this.environment][key] = value;
    },
    put: function(key, value) {
        return this.set(key, value);
    },

    /**
     *  Environment Detection
     */
    environment: null,
    _url: window.location.href,
    detect: function() {
        for (var key in this.environmentURLs) {
            if ( this._urlIsEnvironment(this.environmentURLs[key]) ) {
                this.environment = key;
                return;
            }
        }
        this.environment = this.defaults.environment;
    },
    _urlIsEnvironment: function(env) {
        for (var key in env) {
            if (this._url.toLowerCase().indexOf(env[key]) !== -1) {
                return true;
            }
        }
        return false;
    }
}
window.indystar_environment.detect();
