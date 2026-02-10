"use strict";

$(function () {

    // detect user device

    const isMobile = {
        isTouchDevice: function () {
            return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
        },
        userAgent: function () {
            return /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
        },
        any: function () {
            return isMobile.isTouchDevice() || isMobile.userAgent();
        }
    };

    function getNavigator() {
        if (isMobile.any() || window.innerWidth < 992) {
            $("body").removeClass("_pc").addClass("_touch");
        } else {
            $("body").removeClass("_touch").addClass("_pc");
        }
    }

    getNavigator();

    $(window).on("resize", () => getNavigator());



    // click handler
    $(document).on('click', function (e) {

        let $target = $(e.target);

        // menu
        if ($target.closest('.header__menu-toggler').length) {
            $(".header").toggleClass("open-menu");
        }

        // accordion
        if ($target.is('.faq__item-btn')) {
            $target.toggleClass('active').next().slideToggle()

        }

        // popup tabs
        if ($target.is('.popup__tab-btn')) {
            $target.addClass('active').siblings().removeClass('active');
            $('.popup__tabs-block').eq($target.index()).addClass('active').siblings().removeClass('active');
        }

        // submenu
        if ($target.closest('.menu__link').length) {

            let $menuLink = $target.closest('.menu__link');
            let $submenu = $menuLink.next();
            if ($submenu.length === 0) return;


            if ($("body").hasClass('_pc')) return;

            e.preventDefault();


            if ($menuLink.hasClass('active')) {

                $menuLink.removeClass('active');
                $submenu.removeClass('active');

            } else {

                $('.menu__link').removeClass('active');
                $('.submenu').removeClass('active');

                $menuLink.addClass('active');
                $submenu.addClass('active');
            }

        }

    });

    $(document).on('click touchend', '.fancybox-slide', function (e) {
        if ($(e.target).hasClass('fancybox-slide')) {
            $.fancybox.close();
        }
    });




    // input mask

    var phoneInputs = $('input[type="tel"]');

    if (phoneInputs.length > 0) {
        $("input[type='tel']").inputmask("+7 (999) 999-9999");
    }



    // header height

    getHeaderHeight();

    function getHeaderHeight() {
        const headerHeight = $('.header').outerHeight();
        $("body").css('--header-height', headerHeight + "px");
        return headerHeight;
    }

    window.addEventListener('resize', () => getHeaderHeight());

    window.addEventListener('wheel', function (event) {
        if (event.deltaY > 0) {
            $('header').addClass('scroll');
        } else {
            $('header').removeClass('scroll');
        }
    });

    let lastScrollTop = 0;
    $(window).on('scroll', function () {
        let currentScroll = $(this).scrollTop();
        if (currentScroll < lastScrollTop) {
            $('header').removeClass('scroll');
        }
        lastScrollTop = currentScroll;
    });

    $(window).on('scroll', function () {
        let scrollTop = $(this).scrollTop();
        let docHeight = $(document).height();
        let winHeight = $(this).height();

        let scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;

        if (scrollPercent > 66) {
            $('body').addClass('scrolled-half');
        } else {
            $('body').removeClass('scrolled-half');
        }
    });


    // animation


    gsap.registerPlugin(ScrollTrigger);


    const promoBanner = document.querySelector(".promo__banner");
    const promo = document.querySelector(".promo");

    if (promoBanner && promo) {

        gsap.set(promoBanner, {
            width: window.innerWidth * 0.3333,
            height: window.innerHeight * 0.1,
        });

        gsap.to(promoBanner, {
            width: () => window.innerWidth,
            height: () => window.innerHeight * 0.5,
            scrollTrigger: {
                trigger: promo,
                start: "top top",
                end: () => window.innerHeight / 2,
                scrub: true,
                pin: false,
                anticipatePin: 1,
            },
            ease: "none",
            transformOrigin: "bottom center",
        });
    }


    const directionImages = document.querySelectorAll('.directions__item-image');
    if (directionImages.length) {
        directionImages.forEach((image) => {
            gsap.fromTo(image,
                { maxWidth: '50%' },
                {
                    maxWidth: '100%',
                    ease: 'none',
                    scrollTrigger: {
                        trigger: image,
                        start: 'top 40%',
                        end: 'top 20%',
                        scrub: true,
                    }
                }
            );
        });
    }


    window.addEventListener('load', () => {
        const image = document.querySelector('.project__image');
        const body = document.querySelector('.project__body');

        if (image && body) {
            gsap.to(image, {
                height: window.innerHeight * 0.45,
                duration: 0.6,
                ease: 'power2.out',
                onComplete: () => {
                    gsap.to(image, {
                        height: 270,
                        duration: 1,
                        delay: 0.1,
                        ease: 'power2.out',
                        onComplete: () => {
                            gsap.to(body, {
                                opacity: 1,
                                visibility: 'visible',
                                duration: 0.4,
                                ease: 'power2.out'
                            });
                        }
                    });
                }
            });

            gsap.set(body, {
                opacity: 0,
                visibility: 'hidden'
            });
        }
    });










});
