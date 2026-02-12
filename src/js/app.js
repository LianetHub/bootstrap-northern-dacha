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

        //  menu actions
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

        // accordion
        if ($target.is('.faq__item-btn')) {
            $target.toggleClass('active').next().slideToggle();
        }
        // open submenu on touch devices
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

        // toggle to fav list
        if ($target.is('.favorite-btn')) {
            $target.toggleClass('active');
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

        if (currentScroll > lastScrollTop && currentScroll > 200) {
            $header.addClass('header-scroll-bottom');
            $('body').addClass('header-scroll-bottom');
        } else {
            $header.removeClass('header-scroll-bottom');
            $('body').removeClass('header-scroll-bottom');
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


    // order calc
    function formatPrice(number) {
        return number.toLocaleString('ru-RU') + ' ₽';
    }

    function getPluralOptions(n) {
        let forms = ['опция', 'опции', 'опций'];
        let idx = (n % 10 === 1 && n % 100 !== 11) ? 0 : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
        return n + ' ' + forms[idx];
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
        let tooltipLines = [];

        $('input[name="extra"]:checked').each(function () {
            let name = $(this).data('name');
            let price = parseFloat($(this).data('price') || 0);

            selectedExtras.push(name);
            tooltipLines.push(name + ' — ' + formatPrice(price));
            totalPrice += price;
        });

        const $extraContainer = $('#total-extra');
        if (selectedExtras.length > 0) {
            let text = 'Выбрано ' + getPluralOptions(selectedExtras.length);
            let tooltipHtml = tooltipLines.join('<br>');

            $extraContainer.html(
                text + ' ' +
                '<span data-tooltip title="' + tooltipHtml + '" class="tooltip-btn">' +
                '<img src="img/icons/info.svg" alt="Иконка">' +
                '</span>'
            );
        } else {
            $extraContainer.text('Не выбрано');
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

    // sliders
    $('.news__slider').slick({
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: true,
        appendDots: '.news__dots',
        arrows: false,
        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });


    // tooltip
    $(document).on('mouseenter', '[data-tooltip]', function () {
        var $this = $(this);
        var title = $this.attr('title');

        if (!title) return;

        $this.data('title', title).removeAttr('title');

        var $tooltip = $('<div class="tooltip-block"></div>').html(title);
        $('body').append($tooltip);

        var offset = $this.offset();
        var tooltipWidth = $tooltip.outerWidth();
        var tooltipHeight = $tooltip.outerHeight();
        var elementWidth = $this.outerWidth();
        var windowScrollTop = $(window).scrollTop();

        var top = offset.top - tooltipHeight - 5;
        var left = offset.left + (elementWidth / 2) - (tooltipWidth / 2);

        if (top < windowScrollTop) {
            top = offset.top + $this.outerHeight() + 5;
            $tooltip.addClass('open-bottom');
        } else {
            $tooltip.addClass('open-top');
        }

        if (left < 0) {
            left = 0;
        } else if (left + tooltipWidth > $(window).width()) {
            left = $(window).width() - tooltipWidth;
        }

        $tooltip.css({ top: top, left: left });
    }).on('mouseleave', '[data-tooltip]', function () {
        $('.tooltip-block').remove();
        var $this = $(this);
        var title = $this.data('title');
        if (title) {
            $this.attr('title', title);
        }
    });


    // animation

    gsap.registerPlugin(ScrollTrigger);

    // parallax
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

    // promo block animation
    const $promoSection = $('.promo');
    const $promoVideo = $('.promo__video-wrapper');
    const $promoTitle = $('.promo__title');
    const $promoBody = $('.promo__body');

    if ($promoSection.length && $promoVideo.length && $promoTitle.length) {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: $promoSection,
                start: "top top",
                end: `${$promoSection.outerHeight() / 2} 100px`,
                scrub: 0.5,
            }
        });

        const getMarginValue = () => {
            return -((window.innerWidth - $promoBody.width()) / 2);
        };

        tl.to($promoTitle, {
            opacity: 0,
            y: `${$promoSection.outerHeight() / 3}px`,
        }, 0)
            .fromTo($promoVideo,
                {
                    marginLeft: 0,
                    marginRight: 0,
                },
                {
                    marginLeft: () => getMarginValue(),
                    marginRight: () => getMarginValue(),
                }, 0
            );
    }


});
