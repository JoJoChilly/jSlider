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
            slideClass: 'slide',
            slideNextClass: 'slide-next',
            slidePrevClass: 'slide-prev',
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
        this.wrapper = this.container.children('.' + this.params.wrapperClass);
        this.initSlide = function(){
            var slides = this.wrapper.children('.' + this.params.slideClass);
            console.log($(slides[0]));
            this.wrapper.prepend($(slides[0]).clone());
            this.wrapper.append(slides.eq(slides.length-1).clone());
            this.wrapper.width(this.wrapper.children('.' + this.params.slideClass).length * slides.width());
        }

        this.initEvent = function(){
            this.wrapper.transition(500);
        }

        this.isHorizontal = function(){
            return this.params.direction === 'horizontal';

        }

        // Next, Prev, Index
        if (this.params.slideNextClass) {
            $('.'+this.params.slideNextClass)['on']('click', this.onClickNext);
        }
        // if (s.params.prevButton) {
        //     $(s.params.prevButton)[actionDom]('click', s.onClickPrev);
        // }
        // if (s.params.pagination && s.params.paginationClickable) {
        //     $(s.paginationContainer)[actionDom]('click', '.' + s.params.bulletClass, s.onClickIndex);
        // }
        
        // var distance = 0;
        // this.onClickNext = function(){
        //     this.setWrapperTranslate(distance - this.container.width());
        // }

        function round(a) {
            return Math.floor(a);
        }
        // RTL-Short for 'right to left'
        this.rtl = this.isHorizontal() && (this.container.css('direction') === 'rtl');

        this.setWrapperTranslate = function (translate, updateActiveIndex, byController) {
            var x = 0, y = 0, z = 0;
            if (this.isHorizontal()) {
                x = this.rtl ? -translate : translate;
            }
            else {
                y = translate;
            }
            //set to round length
            x = round(x);
            y = round(y);
            console.log('x: '+x+' ,y: '+y);
            if (this.support.transforms3d) this.wrapper.transform('translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)');
            else this.wrapper.transform('translate(' + x + 'px, ' + y + 'px)');
        
            this.translate = this.isHorizontal() ? x : y;
        
        };

        //实例化
        this.initSlide();
        this.initEvent();
        // this.setWrapperTranslate(-3200);
    }
    JSlider.prototype = {
        support: {    
            transforms3d : (function () {
                var div = document.createElement('div').style;
                return ('webkitPerspective' in div || 'MozPerspective' in div || 'OPerspective' in div || 'MsPerspective' in div || 'perspective' in div);
            })()
        }
    }
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
    }
    window.JSlider = JSlider;
})();