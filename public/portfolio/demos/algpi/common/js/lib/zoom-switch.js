/**
 * @brief   ZoomSwitchJS - For disabling/enabled viewport zooming on mobile devices
 * @note    Requires jQuery for forceRedraw
 * @note    Adapted/synthesized from answers in this thread: http://stackoverflow.com/questions/8840580/force-dom-redraw-refresh-on-chrome-mac
 * @author  James Earlywine  - james.earlywine@indystar.com
 * 
 * @note    In addition to including this library in the head, the page must contain a meta tag for viewport
 *          that has an 'id' attribute set to 'viewport'.  Example:
 *  
 *              <meta id="viewport" name="viewport" content="width=device-width, initial-scale=1">
 */
window.zoomSwitch = {
    defaults            : {
        disableZoom : {
            delay : 0  
        },
        enableZoom : {
            delay: 0
        },
        initialZoom: {
            delay: 0  
        },
        forceRedraw : {
            elementRemoveDelay : 10,
            forceRedrawElementId : 'forceRedrawElement'
        },
        reset : {
            delay : 0,
            disabledTime : 1000
        }
    },
    initialViewport     : document.getElementById('viewport').getAttribute('content'),
    zoomableViewport    : 'width=device-width, initial-scale=1',
    zoomedOutViewport   : 'width=device-width,minimum-scale=1.0,maximum-scale=1.0,initial-scale=1.0',
    /**
     * @brief   Forces a redraw of the page contents
     * @note    Places an element on the page and toggles it's display css-property, to induce page/browser redraw
     * @param   int     elementRemoveDelay      how long should the temp dom-object exist on the page?
     * @param   strnig  forceRedrawElementId    what should the ID be of the temp dom-object?
     */
    forceRedraw         : function(elementRemoveDelay, forceRedrawElementId){
        if (elementRemoveDelay === undefined) {elementRemoveDelay     = this.defaults.forceRedraw.elementRemoveDelay;}
        if (forceRedrawElementId === undefined) {forceRedrawElementId = this.defaults.forceRedraw.forceRedrawElementId;}
        
        $(window).trigger('resize');
        var element = $('<span id="' + forceRedrawElementId + '"></span>');
        $('body').append(element);
        document.getElementById(forceRedrawElementId).style.display = 'none';
        document.getElementById(forceRedrawElementId).style.display = 'block';
        setTimeout(function() {
            element.remove();
        }.bind({element: element}), elementRemoveDelay);
    },
    /**
     * @brief   disables zoom, zooms the viewport all the way out
     * @param   int     delay   delay before the action takes place (in ms)
     */
    disableZoom : function(delay) {
        if (delay === undefined) {delay = this.defaults.disableZoom.delay;}
        
        setTimeout(function() {
            document.getElementById('viewport').setAttribute('content', this.zoomedOutViewport);
            this.forceRedraw()
        }.bind(this), delay);
    },
    /**
     * @brief   enables zoom on viewport
     * @param   int     delay   delay before the action takes place (in ms)
     */
    enableZoom : function(delay) {
        if (delay === undefined) {delay = this.defaults.enableZoom.delay;}
        
        setTimeout(function() {
            document.getElementById('viewport').setAttribute('content', this.zoomableViewport);
            this.forceRedraw();    
        }.bind(this), delay);
    },
    /**
     * @brief   sets the viewport settings to their innitial value
     * @param   int     delay   delay before the action takes place (in ms)
     */
    initalZoom : function(delay) {
        if (delay === undefined) {delay = this.defaults.initialZoom.delay;}
        
        setTimeout(function() {
            document.getElementById('viewport').setAttribute('content', this.initialViewport);
            this.forceRedraw();    
        }.bind(this), delay);
    },
    /**
     * @brief   Resets the viewport zoom level
     * @note    Disables zooming, setting it back to it's initial state, then re-enables it
     * @param   int     delay           time to wait before resetting/disabling viewport zoom (in ms)
     * @param   int     disabledTime    time to wait before re-enabling zoom functionality (in ms)
     */
    reset : function(delay, disabledTime) {
        if (delay === undefined) {delay = this.defaults.reset.delay;}
        if (disabledTime === undefined) {delay = this.defaults.reset.disabledTime;}
        
        setTimeout(function() {
            outter.disableZoom();
            outter.initialZoom(disabledTime);
        }.bind({outter: this, disabledTime: disabledTime}), delay);
    }
};

