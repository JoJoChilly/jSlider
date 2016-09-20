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
            slideClass: 'slide',
            // Next/prev buttons
            nextButton: '',
            prevButton: '',
            wrapperClass: 'slide-wrapper'
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
        };
        this.params=params;

        //$ define
        if (typeof $ === 'undefined') {
            $ = window.jQuery;
            if (!$) return;
        };
        // Export it to Swiper instance
        var jslider = this;
        jslider.$ = $;
        jslider.container = $(container);
        jslider.wrapper = jslider.container.children('.' + jslider.params.wrapperClass);
        jslider.totalSlides = jslider.wrapper.children('.'+jslider.params.slideClass).length;
        jslider.activeIndex = 0;
        jslider.initSlide = function(){
            var slides = jslider.wrapper.children('.' + jslider.params.slideClass);
            jslider.wrapper.append($(slides[0]).clone());
            jslider.wrapper.prepend(slides.eq(slides.length-1).clone());
            jslider.wrapper.width((slides.length+2) * slides.width());
        };

        jslider.initEvent = function(){
            jslider.wrapper.transition(this.params.speed);
            jslider.slideTo(0);
        };

        jslider.isHorizontal = function(){
            return jslider.params.direction === 'horizontal';
        };

        // Next, Prev, Index
        if (jslider.params.nextButton) {
            $(jslider.params.nextButton)['on']('click',function(e){jslider.onClickNext(e);});
        };
        if (jslider.params.prevButton) {
            $(jslider.params.prevButton)['on']('click',function(e){jslider.onClickPrev(e);});
        };
        if (jslider.params.pagination) {
            $(jslider.params.pagination)['on']('mouseenter', jslider.params.paginationElement, function(e){
                var index = $(this).index();
                $(jslider.params.pagination).children(jslider.params.paginationElement).eq(index).addClass('pagination-active').siblings().removeClass('pagination-active');
                jslider.slideTo(index, jslider.params.speed);
            });
        }
        
        jslider.onClickNext = function(e){
            e.preventDefault();
            jslider.slideNext();
        };
        jslider.onClickPrev = function(e){
            e.preventDefault();
            jslider.slidePrev();
        };
        jslider.slideNext = function (runCallbacks, speed) {
            if(jslider.activeIndex === (jslider.totalSlides-1) && jslider.params.loop){
                if(jslider.fixLoop('rtl')){
                    return jslider.slideTo(0, this.params.speed, runCallbacks);
                }
            }else{
                return jslider.slideTo((jslider.activeIndex+1), speed, runCallbacks);
            }
        };
        jslider.slidePrev = function (runCallbacks, speed) {
            if(jslider.activeIndex === 0 && jslider.params.loop){
                if(jslider.fixLoop('ltr')){
                    return jslider.slideTo((jslider.totalSlides-1),this.params.speed, runCallbacks);
                }
            }else{
                return jslider.slideTo((jslider.activeIndex-1), speed, runCallbacks);
            }
        };

        jslider.slideTo = function (slideIndex, speed, runCallbacks) {
            var slideWidth = $('.'+jslider.params.slideClass).width();
            jslider.setWrapperTranslate(-(slideIndex+1)*slideWidth);
            jslider.updateActiveIndexClass(slideIndex);
            jslider.wrapper.transition(jslider.params.speed);
            return true;
        };
        jslider.updateActiveIndexClass = function(num){
            jslider.activeIndex = num;
            if (num > -1 && num < jslider.totalSlides) {
                jslider.wrapper.children('.'+jslider.params.slideClass).eq(num).addClass('active-slide').siblings().removeClass('active-slide');
            }
        };
        function round(a) {
            return Math.floor(a);
        };
        // RTL-Short for 'right to left'
        jslider.rtl = jslider.isHorizontal() && (jslider.container.css('direction') === 'rtl');

        jslider.setWrapperTranslate = function (translate, updateActiveIndex, byController) {
            var x = 0, y = 0, z = 0;
            if (jslider.isHorizontal()) {
                x = jslider.rtl ? -translate : translate;
            }
            else {
                y = translate;
            }
            //set to round length
            x = round(x);
            y = round(y);
            if (jslider.support.transforms3d) jslider.wrapper.transform('translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)');
            else jslider.wrapper.transform('translate(' + x + 'px, ' + y + 'px)');
        
            jslider.translate = jslider.isHorizontal() ? x : y;
        
        };
        jslider.fixLoop = function (direction) {
            //Fix For Negative Oversliding
            if (direction === 'ltr') {
                var slides = jslider.wrapper.children('.' + jslider.params.slideClass);
                var distance = -(slides.length-1) * slides.width();
                jslider.wrapper.transition(0);
                jslider.setWrapperTranslate(distance);
                return true;
            }
            //Fix For Positive Oversliding
            else if (direction === 'rtl') {
                jslider.wrapper.transition(0);
                jslider.setWrapperTranslate(0);
                return true;
            }
        };

        //实例化
        jslider.initSlide();
        jslider.initEvent();
        // jslider.setWrapperTranslate(-3200);
    };
    JSlider.prototype = {
        support: {    
            transforms3d : (function () {
                var div = document.createElement('div').style;
                return ('webkitPerspective' in div || 'MozPerspective' in div || 'OPerspective' in div || 'MsPerspective' in div || 'perspective' in div);
            })()
        }
    };
    if (window.jQuery) {
        window.jQuery.fn.transition = function(duration){
            if (typeof duration !== 'string') {
                duration = duration + 'ms';
            }
            for (var i = 0; i < this.length; i++) {
                var elStyle = this[i].style;
                elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
            }
            return this;
        }
        window.jQuery.fn.transform = function (transform) {
            for (var i = 0; i < this.length; i++) {
                var elStyle = this[i].style;
                elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
            }
            return this;
        };
    };
    window.JSlider = JSlider;
})();