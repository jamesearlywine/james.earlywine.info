/* global angular */
/* global $ */
/**
 * History Service 
 */
 angular.module('SubmissionService', [])
    .factory('SubmissionService', [
        '$http',
        '$q',
        'AppConfig',
        function(
            $http,
            $q,
            AppConfig
        )
        {
            return {
                submitForm: function(options) {
                    return $http({
                        method: 'POST',
                        url: options.formEndpoint,
                        data: $.param(options.formData),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });
                },
                submitSocial: function() {
                    return $http.get(AppConfig.endpoints.entrySocial);
                },
                getWhoAmI: function() {
                    return $http.get(AppConfig.endpoints.whoAmI);
                }
                
            };
            
        }
    ])
;
        