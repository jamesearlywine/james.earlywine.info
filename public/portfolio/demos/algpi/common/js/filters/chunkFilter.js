angular.module('chunkFilter', [
        'ngLodash',
    ])
    .filter('chunk', function(lodash) {
        return lodash.memoize(lodash.chunk);    
    })
;