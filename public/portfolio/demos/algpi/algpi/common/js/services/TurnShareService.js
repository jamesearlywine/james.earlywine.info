'use strict';
/* globals angular, indystar_environment, $ */

/**
 * A Simple Share Service for AngularJS
 */
 angular.module('TurnShareService', [])
    .factory('TurnShareService', [
        'BubblesService',
        'ShareService',
        'AppConfig',
        function(
            BubblesService,
            ShareService,
            AppConfig
        )
        {
            return {
                turnData : {},
                shareSettings : {},
                defaultShareSettings : {
                    facebookAppId : indystar_environment.get('shareSettings').facebookAppId,
                    link        : indystar_environment.get('shareSettings').landingPageUrl,
                    title       : 'Turn #{turnNumber} - Angie\'s List Grand Prix of Indianapolis',
                    tweet       : null, // using the value for title (calculated from turn data, or feature data)
                    description : null, // using the value calculated from turn description
                    caption     : window.indystar_environment.get('shareSettings').caption,
                    media       : window.indystar_environment.get('shareSettings').media,
                    redirectUrl : window.indystar_environment.get('shareSettings').redirectUrl,
                    emailSubject: null, // using the value calculated for title
                    emailBody   : null // using the value calculate from turn description
                },
                initShareSettings : function() {
                    this.shareSettings = angular.extend({}, this.defaultShareSettings);
                },
                shareTurn : function(turnNumber, network) {
                    this.initShareSettings();
                    console.log('sharing turn number: ', turnNumber);
                    this.turnData = BubblesService.bubbles[turnNumber];
                    console.log('turnData: ', this.turnData);
                    
                    if (turnNumber > 14) {
                    
                        this.shareSettings.title = this.turnData.title + ' - Angie\'s List Grand Prix of Indianapolis';
                        
                        var firstParagraph  = $($(
                            this.turnData.text.$$unwrapTrustedValue()
                        )[0]).text();
                        var theRest = $($(
                            this.turnData.text.$$unwrapTrustedValue()
                        )[2]).text();
                        
                        window.theRest = theRest;
                        this.shareSettings.description = firstParagraph + ' - ' + theRest;
                    
                    } else {
                        this.shareSettings.title = this.shareSettings.title.replace(/\{turnNumber\}/g, turnNumber);
                        this.shareSettings.description = $(this.turnData.text.$$unwrapTrustedValue()).text();
                        
                    }
                    this.shareSettings.tweet = this.shareSettings.title;

                    this.shareSettings.link = 'http:' 
                                            + indystar_environment.get('baseURL') 
                                            + '/#/home/turn/' 
                                            + turnNumber
                    ;
                    if (this.turnData.photo != "") {
                        this.shareSettings.media = 'http:'
                                                 + indystar_environment.get('baseURL') 
                                                 + '/'
                                                 + this.turnData.photo.$$unwrapTrustedValue()
                        ;
                    }

                    
                    this.shareSettings.emailSubject = this.shareSettings.title;
                    this.shareSettings.emailBody    = this.shareSettings.description.replace(/\s\s+/g, ' ')
                        + '\n\n' + this.shareSettings.link
                    ;
                    
                    // console.log('shareSettings: ', this.shareSettings);
                    
                    ShareService.settings(this.shareSettings);
                    ShareService.share(network);
                },
                
                
            };
            
        }
    ])
;