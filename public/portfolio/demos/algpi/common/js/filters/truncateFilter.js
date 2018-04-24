angular.module('truncateFilter', [])
    .filter('truncate', function() {
        return function(input, limit) {
            if (    input === undefined
                ||  input === null   
                ||  input.length <= limit) 
            {
                return input;
            }
            return input.substring(0, limit).trim() + '...'
        }       
    })
;