/* global angular */

/**
 * History Service 
 */
 angular.module('HistoryService', [])
    .factory('HistoryService', [

        function(
            
        )
        {
            return {
                
                _history : [],
                
                add : function(entry) {
                    this._history.push(entry);
                    return this;
                },
                
                contains : function(entry) {
                    return this._history.indexOf(entry) !== -1;
                },
                
                clear : function() {
                    this._history = [];
                }
                
            };
            
        }
    ])
;
        