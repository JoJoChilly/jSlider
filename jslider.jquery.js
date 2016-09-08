;(function(){
    'use strict';
    var $;
    var JSlider = function(container, params){
        if (!(this instanceof JSlider)) return new JSlider(container, params);
        //default settings
        var defaults = {
            direction: 'horizontal',
            initialSlide: 0,
            speed: 300,
            autoPlay: false,
            loop: true,
            iOSEdgeSwipeDetection: false,
            pagination: null,
            paginationElement: 'span',
            paginationClickable: false,
            paginationHide: false,
            nextButton: null,
            prevButton: null,
            slideClass: 'swiper-slide',
        };

        //set settings
        var params = params || {};
        for (var def in defaults) {
            if (typeof params[def] === 'undefined') {
                params[def] = defaults[def];
            }
            else if (typeof params[def] === 'object') {
                for (var deepDef in defaults[def]) {
                    if (typeof params[def][deepDef] === 'undefined') {
                        params[def][deepDef] = defaults[def][deepDef];
                    }
                }
            }
        }
        this.params=params;
        // console.log(params.speed);

        //$ define
        if (typeof $ === 'undefined') {
            $ = window.jQuery;
            if (!$) return;
        }
        // Export it to Swiper instance
        this.$ = $;
        this.container = $(container);
        console.log(this.container);
    }
    JSlider.prototype = {

    }
    window.JSlider = JSlider;
})();