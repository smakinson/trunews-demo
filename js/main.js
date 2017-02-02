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

    }); // end ready

    function setupSlides(id, listId) {
        var paused = false;
        var speed = 1, delay = 5, fullDelay = speed + delay;
        var startZ = 12000;
        var slides = $(id + ' > .slide');
        var slidesListItems = $(listId + ' > li');
        var slidesListLinks = slidesListItems.find('a');
        var numSlides = slides.length;

        // Duplicate the first slide to the end for visual effect as the last slide fades out.
        $(id).append(slides.first().clone());

        function orderSlides() {
            // Stacks the slides to match the top down order of the list.
            slides.each(function (index) {
                $(this).css('z-index', startZ + (numSlides - index));
            });
        }

        orderSlides();

        // Mark the first one in the links list as active.
        slidesListLinks.first().addClass('active');

        var tl = new TimelineMax({
            paused: true, delay: fullDelay,
            repeat: -1, //repeatDelay: fullDelay,
        });

        slides.each(function (index) {
            var label = 'slide' + index;

            tl.addLabel(label);

            // Assign the label for the list to use.
            slidesListLinks.eq(index).data('targetLabel', label);

            tl.fromTo($(this), speed,
                { alpha: 1 },
                {
                    alpha: 0,
                    onCompleteParams: ['{self}'],
                    onComplete: function (self) {
                        var slide = $(self.target);
                        var activeSlideIndex = slide.index() + 1;

                        if (activeSlideIndex == numSlides) {
                            activeSlideIndex = 0;
                            TweenMax.set(slides, { alpha: 1 });
                        }

                        // Highlight the proper item in the slide list.
                        slidesListLinks.removeClass('active');
                        slidesListLinks.eq(activeSlideIndex).addClass('active');
                    }, ease: Quad.easeInOut
                }, '+=' + fullDelay
            );
            tl.addPause('+=0', function () {
                if (!paused) {
                    tl.resume();
                }
            });
        });

        var slideColTween, slideListColTween;

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
            if (! skel.vars.touch && skel.breakpoint("large").active) {
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
            }
        });

        slides.parent().on('mouseleave', function (event) {
            if (tl.paused()) tl.play();
            paused = false;

            if (slideColTween) {
                slideColTween.timeScale(3);
                slideColTween.reverse();
            }
            if (slideListColTween) {
                slideListColTween.timeScale(3);
                slideListColTween.reverse();
            }
        });

        slidesListLinks.on('click', function (event) {
            var link = $(event.target);
            var label = link.data('targetLabel');
            tl.seek(label);

            // Update the list to match.
            slidesListLinks.removeClass('active');
            link.addClass('active');

            return false;
        });

        tl.play();
    }

}($));