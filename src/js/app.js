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
        let $header = $('.header');

        if ($target.closest('.header__menu-toggler').length) {
            $header.toggleClass("open-menu");
        }

        if ($target.is('.header')) {
            closeSubmenus();
        }

        if ($target.is('.faq__item-btn')) {
            $target.toggleClass('active').next().slideToggle();
        }

        if ($target.is('.popup__tab-btn')) {
            $target.addClass('active').siblings().removeClass('active');
            $('.popup__tabs-block').eq($target.index()).addClass('active').siblings().removeClass('active');
        }

        if ($target.closest('.menu__link, .header__projects-btn').length) {
            let $btn = $target.closest('.menu__link, .header__projects-btn');
            let $submenu = $btn.next('.submenu');

            if ($submenu.length === 0 || $("body").hasClass('_pc')) return;

            e.preventDefault();

            if ($btn.hasClass('active')) {
                closeSubmenus();
            } else {
                $('.menu__link, .header__projects-btn, .submenu').removeClass('active');
                $btn.addClass('active');
                $submenu.addClass('active');
                $header.addClass('open-submenu');
            }
        }
    });

    function closeSubmenus() {
        $('.header').removeClass('open-submenu');
        $('.menu__link, .header__projects-btn, .submenu').removeClass('active');
    }

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

    let lastScrollTop = 0;

    $(window).on('scroll', function () {
        let currentScroll = $(this).scrollTop();
        let $header = $('.header');

        if (currentScroll > 0) {
            $header.addClass('scroll');
        } else {
            $header.removeClass('scroll');
        }

        if (currentScroll > lastScrollTop && currentScroll > 0) {
            $header.addClass('header-scroll-bottom');
        } else {
            $header.removeClass('header-scroll-bottom');
        }

        lastScrollTop = currentScroll;
    });

    $(document).on('mouseenter', '.menu__item, .header__projects', function () {
        if ($("body").hasClass("_pc")) {
            let $this = $(this);
            let $submenu = $this.find('.submenu');

            if ($submenu.length > 0) {
                $('.header').addClass('open-submenu');
                $this.find('.menu__link, .header__projects-btn').addClass('active');
                $submenu.addClass('active');
            }
        }
    });

    $(document).on('mouseleave', '.menu__item, .header__projects', function () {
        if ($("body").hasClass("_pc")) {
            closeSubmenus();
        }
    });

    // animation


    gsap.registerPlugin(ScrollTrigger);











});
