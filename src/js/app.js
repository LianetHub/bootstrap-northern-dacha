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




    // animation


    gsap.registerPlugin(ScrollTrigger);











});
