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
        let $body = $('body');

        if ($target.closest('.header__menu-toggler').length) {
            $header.toggleClass("open-menu");
            $body.toggleClass("lock-menu");
        }

        if ($target.hasClass('menu') && !$target.closest('.menu__content').length) {
            $header.removeClass("open-menu");
            $body.removeClass("lock-menu");
            closeSubmenus();
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

    // header height

    getHeaderHeight();

    function getHeaderHeight() {
        const headerHeight = $('.header').outerHeight() ?? 0;
        $("body").css('--header-height', headerHeight + "px");
        return headerHeight;
    }

    window.addEventListener('resize', () => getHeaderHeight());

    let lastScrollTop = $(window).scrollTop();

    function checkScroll() {
        let currentScroll = $(window).scrollTop();
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
    }

    checkScroll();

    $(window).on('scroll', function () {
        checkScroll();
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



    // input mask

    var phoneInputs = $('input[type="tel"]');

    if (phoneInputs.length > 0) {
        $("input[type='tel']").inputmask("+7 (999) 999-9999");
    }

    // tooltip
    // $('[data-tooltip]').on('mouseenter', function () {
    //     var $this = $(this);
    //     var title = $this.attr('title');

    //     $this.data('title', title).removeAttr('title');

    //     var $tooltip = $('<div class="tooltip-block"></div>').text(title);
    //     $('body').append($tooltip);

    //     var offset = $this.offset();
    //     var tooltipWidth = $tooltip.outerWidth();
    //     var tooltipHeight = $tooltip.outerHeight();
    //     var elementWidth = $this.outerWidth();
    //     var windowScrollTop = $(window).scrollTop();

    //     var top = offset.top - tooltipHeight - 5;
    //     var left = offset.left + (elementWidth / 2) - (tooltipWidth / 2);

    //     if (top < windowScrollTop) {
    //         top = offset.top + $this.outerHeight() + 5;
    //         $tooltip.addClass('open-bottom');
    //     } else {
    //         $tooltip.addClass('open-top');
    //     }

    //     if (left < 0) {
    //         left = 0;
    //     } else if (left + tooltipWidth > $(window).width()) {
    //         left = $(window).width() - tooltipWidth;
    //     }

    //     $tooltip.css({ top: top, left: left });
    // }).on('mouseleave', function () {
    //     $('.tooltip-block').remove();
    //     var $this = $(this);
    //     var title = $this.data('title');
    //     $this.attr('title', title);
    // });


    // order calc
    function formatPrice(number) {
        return number.toLocaleString('ru-RU') + ' ₽';
    }

    function updateOrder() {
        let totalPrice = 0;

        let complectInput = $('input[name="complect"]:checked');
        $('#total-complect').text(complectInput.data('name'));
        totalPrice += parseFloat(complectInput.data('price') || 0);

        let foundationInput = $('input[name="foundation"]:checked');
        $('#total-foundation').text(foundationInput.data('name'));
        totalPrice += parseFloat(foundationInput.data('price') || 0);

        let roofInput = $('input[name="roof"]:checked');
        $('#total-roof').text(roofInput.data('name'));
        totalPrice += parseFloat(roofInput.data('price') || 0);

        let selectedExtras = [];
        $('input[name="extra"]:checked').each(function () {
            selectedExtras.push($(this).data('name'));
            totalPrice += parseFloat($(this).data('price') || 0);
        });

        if (selectedExtras.length > 0) {
            $('#total-extra').text(selectedExtras.join(', '));
        } else {
            $('#total-extra').text('Не выбрано');
        }

        $('#final-price').text(formatPrice(totalPrice));

        $('.order__step-input').each(function () {
            const label = $(this).closest('.order__step-block');
            const btnText = label.find('.order__step-bottom');

            if ($(this).is(':checked')) {
                btnText.text('Выбрано');
                label.addClass('is-selected');
            } else {
                btnText.text('Выбрать');
                label.removeClass('is-selected');
            }
        });
    }

    $('.order__step-input').on('change', function () {
        updateOrder();
    });

    updateOrder();

    // animation


    gsap.registerPlugin(ScrollTrigger);

    gsap.registerPlugin(ScrollTrigger);

    const parallaxImages = document.querySelectorAll('.parallax-image img');

    parallaxImages.forEach((image) => {
        gsap.fromTo(image, {
            yPercent: -30
        }, {
            yPercent: 30,
            ease: "none",
            scrollTrigger: {
                trigger: image.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });


});
