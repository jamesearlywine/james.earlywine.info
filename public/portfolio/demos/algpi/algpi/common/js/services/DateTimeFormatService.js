'use strict';
/* global angular */

angular.module('DateTimeFormatService', [])
    .factory('DateTimeFormatService', [
        'lodash',
        'AppConfig',
        function(
            lodash,
            AppConfig
        )
        {
            return {
                
                formatMysqlDateTime: function(strMysqlDateTime) 
                {
                    var strDateTime = strMysqlDateTime.replace(/ /g, 'T');
                    var d = new Date(strDateTime);
                    
                    var formatted = '';
                    
                    if (d.getHours() > 11) {
                        var hour = (parseInt( ('0' + d.getHours()).slice(-2), 10 ) - 12);
                        if ( hour === 0  ) {
                            hour = 12;
                        }
                        formatted = 
                            (d.getMonth() + 1) 
                            + '/' 
                            + d.getDate()
                            + '/'
                            + d.getFullYear()
                            + ' '
                            + hour
                            + ':'
                            + ('0' + d.getMinutes()).slice(-2)
                            + 'PM'
                        ;
                    } else {
                        if (d.getHours() == 0) {
                            formatted = 
                                (d.getMonth() + 1) 
                                + '/' 
                                + d.getDate()
                                + '/'
                                + d.getFullYear()
                                + ' '
                                + '12'
                                + ':'
                                + ('0' + d.getMinutes()).slice(-2)
                                + 'AM'
                            ;    
                        } else {
                            formatted = 
                                (d.getMonth() + 1) 
                                + '/' 
                                + d.getDate()
                                + '/'
                                + d.getFullYear()
                                + ' '
                                + (parseInt( ( '0' + d.getHours()).slice(-2), 10 ) )
                                + ':'
                                + ('0' + d.getMinutes()).slice(-2)
                                + 'AM'
                            ; 
                        }
    
                    }
                    
                    return formatted;
                    
                }

            }; // end return 
            
        } // end function()
        
    ]) // end service()
    
; // end angular.module()