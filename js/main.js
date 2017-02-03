/*! modernizr 3.3.1 (Custom Build) | MIT *
 * https://modernizr.com/download/?-csspointerevents-setclasses !*/
!function(e,n,s){function t(e,n){return typeof e===n}function o(){var e,n,s,o,a,i,f;for(var c in l)if(l.hasOwnProperty(c)){if(e=[],n=l[c],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(s=0;s<n.options.aliases.length;s++)e.push(n.options.aliases[s].toLowerCase());for(o=t(n.fn,"function")?n.fn():n.fn,a=0;a<e.length;a++)i=e[a],f=i.split("."),1===f.length?Modernizr[f[0]]=o:(!Modernizr[f[0]]||Modernizr[f[0]]instanceof Boolean||(Modernizr[f[0]]=new Boolean(Modernizr[f[0]])),Modernizr[f[0]][f[1]]=o),r.push((o?"":"no-")+f.join("-"))}}function a(e){var n=c.className,s=Modernizr._config.classPrefix||"";if(u&&(n=n.baseVal),Modernizr._config.enableJSClass){var t=new RegExp("(^|\\s)"+s+"no-js(\\s|$)");n=n.replace(t,"$1"+s+"js$2")}Modernizr._config.enableClasses&&(n+=" "+s+e.join(" "+s),u?c.className.baseVal=n:c.className=n)}function i(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):u?n.createElementNS.call(n,"http://www.w3.org/2000/svg",arguments[0]):n.createElement.apply(n,arguments)}var r=[],l=[],f={_version:"3.3.1",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var s=this;setTimeout(function(){n(s[e])},0)},addTest:function(e,n,s){l.push({name:e,fn:n,options:s})},addAsyncTest:function(e){l.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=f,Modernizr=new Modernizr;var c=n.documentElement,u="svg"===c.nodeName.toLowerCase();Modernizr.addTest("csspointerevents",function(){var e=i("a").style;return e.cssText="pointer-events:auto","auto"===e.pointerEvents}),o(),a(r),delete f.addTest,delete f.addAsyncTest;for(var p=0;p<Modernizr._q.length;p++)Modernizr._q[p]();e.Modernizr=Modernizr}(window,document);

;(function ($) {

    skel.on('ready', function () {

        skel.breakpoints({
            xlarge: "(min-width: 1367px) and (max-width: 1680px)",
            large: "(min-width: 981px) and (max-width: 1366px)",
            medium: "(min-width: 737px) and (max-width: 980px)",
            small: "(min-width: 481px) and (max-width: 736px)",
            xsmall: "(max-width: 480px)"
        });

        skel.layout({
            grid: true,
            containers: 1280,
            conditionals: true,
            breakpoints: {
                large: {
                    containers: '90%'
                },
                medium: {
                    containers: '95%'
                }
            }
        });

        // Setup the homepage slider.
        setupSlides('#home-slides', '#home-slides-list');

        // Sticky top nav.
        var header = $("#header"),
            lockClass = 'locked',
            lockPosition = $('#header-lock').height();

        $('#logo-alt').removeAttr('style');
        checkTopNav();

        $(window).scroll(function () {
            checkTopNav();
        });

        function checkTopNav() {
            if ($(this).scrollTop() > lockPosition) {
                header.addClass(lockClass);
            } else {
                header.removeClass(lockClass);
            }
        }

        // Hamburger menu
        $('#hamburger').on('click', function (event) {
            alert('TODO: Open menu');
            return false;
        });


        // Add the dimmer this way to avoid z-indexes and work with older browsers as well.
        // This must be done after setting up the slides.
        var dimSelector = '.dim', fullAlpha = 1;
        if (skel.vars.IEVersion < 9) {
            fullAlpha = 0.5;
            dimSelector = '.dim-bg';

            $('.hero a.target').append('<div class="dim"><div><div class="dim-bg">&nbsp;</div></div>');
            TweenMax.set($('.hero a.target').find('.dim'), { backgroundColor: 'transparent', backgroundImage: 'none' });
            TweenMax.set($('.hero a.target').find(dimSelector), { alpha: fullAlpha });
        } else {
            $('.hero a.target').append('<div class="dim"></div>');
        }

        $('.hero a.target').on('mouseenter', function (event) {
            TweenMax.to($(this).find(dimSelector), .3, { alpha: 0 });
        });
        $('.hero a.target').on('mouseleave', function (event) {
            TweenMax.to($(this).find(dimSelector), .3, { alpha: fullAlpha });
        });

        if (! Modernizr.csspointerevents) {
            // make up for lack of pointer-events: none supported in some browsers.
            $('.hero').each(function (index) {

                var h = $(this);
                var heroLink = h.find('a.target').attr('href');
                h.append('<a href="' + heroLink + '" class="button fit special">Read More</a>');
            });
        }

    }); // end ready

    function setupSlides(id, listId) {
        var paused = false;
        var speed = 1, delay = 1, fullDelay = speed + delay;
        var slides = $(id + ' > .slide');
        var slidesListItems = $(listId + ' > li');
        var slidesListLinks = slidesListItems.find('a');
        var slideLabelPrefix = 'slide';

        // Mark the first one in the links list as active.
        slidesListLinks.first().addClass('active');

        function onUpdateHandler(self, listIndex) {
            if (self.progress() >= 0.5 && self.progress() >= 0.6) {
                var slide = $(self.target);

                if (listIndex == undefined) listIndex = slide.index();

                // Highlight the proper item in the slide list.
                slidesListLinks.removeClass('active');
                slidesListLinks.eq(listIndex).addClass('active');
            }
        }

        // Create the timeline animation for the slides.
        var tl = new TimelineMax({
            paused: true, delay: fullDelay,
            repeat: -1
        });

        slides.each(function (index) {

            var slide = $(this);

            // Inject the link handler using the link data provided.
            slide.prepend('<a href="' + slide.data('slideLink') + '" class="target">&nbsp;</a>');

            // Assign the label for the list to use.
            slidesListLinks.eq(index).data('targetLabel', slideLabelPrefix + (index + 1));

            if (index > 0) {

                var label = slideLabelPrefix + index;

                tl.addLabel(label);
                slide.data('label', label);

                // All slides are hidden initially except the first one.
                TweenMax.set(slide, { autoAlpha: 0 });

                tl.to(slide, speed,
                    {
                        autoAlpha: 1,
                        onUpdateParams: ['{self}'],
                        onUpdate: onUpdateHandler,
                        onCompleteParams: ['{self}'],
                        onComplete: function (self) {
                            var slide = $(self.target);
                            var prevSlide = slide.prev();

                            if (prevSlide.length > 0 && prevSlide.index() > 0) {
                                TweenMax.set(prevSlide, { alpha: 0 });
                            }
                        }, ease: Quad.easeInOut
                    }, '+=' + fullDelay
                );
                tl.addPause('+=0', function () {
                    if (!paused) {
                        tl.resume();
                    }
                });
            }
        });

        // Now fade the last slide back out to appear to be starting over.
        var lastSlide = slides.last();
        var label = slideLabelPrefix + '0';

        tl.addLabel(label);
        slidesListLinks.eq(lastSlide.index()).data('targetLabel', label);

        tl.to(lastSlide, speed,
            {
                autoAlpha: 0,
                onUpdateParams: ['{self}', 0],
                onUpdate: onUpdateHandler,
                ease: Quad.easeInOut
            }, '+=' + fullDelay
        );
        tl.addPause('+=0', function () {
            if (!paused) {
                tl.resume();
            }
        });

        // And go!
        tl.play();

        // Setup the slides nav.
        slidesListLinks.on('click', function (event) {
            var link = $(event.target);
            var label = link.data('targetLabel');
            tl.seek(label);

            // Update the list to match.
            slidesListLinks.removeClass('active');
            link.addClass('active');

            return false;
        });


        //var slideColTween, slideListColTween;

        slides.parent().on('mouseenter', function (event) {

            // Is the current slide on its way out?
            var currentLabel = tl.currentLabel();
            var labelTime = tl.getLabelTime(currentLabel);

            paused = true;

            if (tl.time() > labelTime && tl.time() < labelTime + (speed * 0.8)) {
                tl.pause();
                tl.tweenTo(labelTime);
            }

            // Show some more of the slide on mouse enter, but not on a touch screen.
            /*if (! skel.vars.touch && skel.breakpoint("large").active) {
             slideColTween = TweenMax.to('#home-slide-col', .5, {
             width: '74%',
             ease: Back.easeOut, onReverseComplete: function () {
             $('#home-slide-col').removeAttr('style');
             }
             });
             slideListColTween = TweenMax.to('#home-slide-list-col', .5, {
             width: '26%', ease: Back.easeOut, onReverseComplete: function () {
             $('#home-slide-list-col').removeAttr('style');
             }
             });
             }*/
        });

        slides.parent().on('mouseleave', function (event) {
            if (tl.paused()) tl.play();
            paused = false;

            /*if (slideColTween) {
             slideColTween.timeScale(3);
             slideColTween.reverse();
             }
             if (slideListColTween) {
             slideListColTween.timeScale(3);
             slideListColTween.reverse();
             }*/
        });

    }

}($));