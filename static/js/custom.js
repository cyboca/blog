/* Back to Top button behaviour */
    var pxShow = 100;
    var scrollSpeed = 500;
    $(window).scroll(function() {
        if ($(window).scrollTop() >= pxShow) {
            $("#gotoTop").addClass('visible');
        } else {
            $("#gotoTop").removeClass('visible');
        }
    });

    $('#gotoTop a').on('click', function() {
        $('html, body').animate({
            scrollTop: 0
        }, scrollSpeed);
        ;
        return false;
    });
