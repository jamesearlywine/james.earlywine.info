angular.module('insertNullFilter', [

    ])
    .filter('insertNull', function() {
        /**
         * Insert null into specific locations/indices in an array
         */
        return function(arr, arrIndices) {
            for (var key in arrIndices) {
                if (arr[arrIndices[key]] == undefined) {
                    arr.push(null);
                } else {
                    if (arrIndices[key] < arr.length) {
                        arr.splice(arrIndices[key], 0, null);    
                    } else {
                        arr.splice(arr.length, 0, null)
                    }    
                }
            }
            return arr;
        };
    })
;