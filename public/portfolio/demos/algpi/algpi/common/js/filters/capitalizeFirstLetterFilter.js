/* global angular */
angular.module('capitalizeFirstLetterFilter', [])
    .filter('capitalizeFirstLetter', function() {
        return function(string) {
            if (string === null || string === undefined) {return string;}
            return string.charAt(0).toUpperCase() + string.slice(1);
        }       
    })
;