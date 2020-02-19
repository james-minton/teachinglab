// Hide Header on on scroll down
var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = $('nav').outerHeight();

$(window).scroll(function(event){
    didScroll = true;
});

setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
}, 250);

function hasScrolled() {
    var st = $(this).scrollTop();

    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= delta)
        return;

    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if (st > lastScrollTop && st > navbarHeight){
        // Scroll Down
        $('nav').removeClass('nav-down').addClass('nav-up');
        $('header').addClass('shadow-lite');
    } else {
        // Scroll Up
        if(st + $(window).height() < $(document).height()) {
            $('nav').removeClass('nav-up').addClass('nav-down');
            $('header').removeClass('shadow-lite');
        }
    }
    lastScrollTop = st;
}
// Multi-slide carousel

$('#recipeCarousel').carousel({
  interval: 2000
})

$('#recipeCarousel.carousel .carousel-item').each(function(){
    var next = $(this).next();
    if (!next.length) {
    next = $(this).siblings(':first');
    }
    next.children(':first-child').clone().appendTo($(this));

    for (var i=0;i<2;i++) {
        next=next.next();
        if (!next.length) {
        	next = $(this).siblings(':first');
      	}

        next.children(':first-child').clone().appendTo($(this));
      }
});

// Reverse Homepage Panel 3 Slider Direction

// $( document ).ready(function() {
/*
$('#panel3').carousel({
    interval: false,
    });
 setInterval(function(){$('#panel3').carousel('prev'); }, 3000);
 $('#panel3').hover(function() {
    $(this).carousel('pause');
}, function() {
    $(this).carousel('cycle');
}); */
 //   });
// Add toggling of menu

var $hamburger = $(".hamburger");
var $flyout = $(".app-menu");
  $hamburger.on("click", function(e) {
    $flyout.toggleClass("is-active");
    // Do something else, like open/close menu
  });

// Highlight page section on scroll

$(window).on('scroll', function() {
    $('.target').each(function() {
        if($(window).scrollTop() >= $(this).offset().top -500) {
            var id = $(this).attr('id');
            $('h3').removeClass('active');
            $('h3[ id='+ id +']').addClass('active');
        }
    });
});

// Carousel item # of total

var totalItems = $('.carousel-item').length;
var currentIndex = $('div.active').index() + 1;
$('.num').html(''+currentIndex+'/'+totalItems+'');


$('#tv-carousel').on('slid.bs.carousel', function() {
    currentIndex = $('div.active').index() + 1;
   $('.num').html(''+currentIndex+' of '+totalItems+'');
});

// Parallax image responsive positioning


var panel = $("#homepage #panel1");
function checkSize(){
    if ($("#panel1").css("height") == "540px"){

        panel.data("positionY", "-99%");
    }
    else if ($("#panel1").css("height") == "420px"){

        panel.data("positionY", "-68%");
    }
    else if ($("#panel1").css("height") == "248px"){

        panel.data("positionY", "-56px");
    }

}

$(document).ready(function() {
    // run test on initial page load
    checkSize();

    // run test on resize of the window
    $(window).resize(checkSize);

    // Fix to accommodate parallax.js bug on Chrome
    var isChromium = window.chrome;
    var winNav = window.navigator;
    var vendorName = winNav.vendor;
    var isOpera = typeof window.opr !== "undefined";
    var isIEedge = winNav.userAgent.indexOf("Edge") > -1;
    var isIOSChrome = winNav.userAgent.match("CriOS");

    if (isIOSChrome) {
       // is Google Chrome on IOS
       // console.log('Is chrome, applying parallax image fix.');
       setTimeout(function() {
         $('.parallax-mirror').css('z-index', 'auto');
       }, 1000);
    } else if(
      isChromium !== null &&
      typeof isChromium !== "undefined" &&
      vendorName === "Google Inc." &&
      isOpera === false &&
      isIEedge === false
    ) {
        // console.log('Is chrome, applying parallax image fix.');
        setTimeout(function() {
          $('.parallax-mirror').css('z-index', 'auto');
        }, 1000);
    }

    if (tweetPath && tweetPath.length >= 0 && $('#tweetsParent').length >= 1) {
      // console.log('testing main.js ' + tweetPath);
      $.ajax({
        type: "GET",
        url: tweetPath + "/gettweets/",
        headers: {
          'content-type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        success: function(result) {
          // console.log(result);
          // Build slides from result
          var slides = Object.values(result);
          // console.log(slides[0]);
          var content = '';
          slides.forEach(function(el, i) {

            // Build slide markup
            var slide =
              '<a href="https://twitter.com/' +
              el.user.screen_name +
              '/status/' +
              el.id_str +
              '" class="tweet" target="_blank">' +
              '<i class="fab fa-twitter"></i>' +
              '<div class="text"><div class="center">' + el.text + '</div></div>' +
              '</a>';

            // Insert slide
            content += slide;
          });
          // console.log(content);
          // Inject into page
          $('#tweetsParent')
          .html(content)
          .slick({
            dots: true,
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            autoplay: true, // Turn this to true before deploying.
            autoplaySpeed: 2000,
            accessibility: true,
            // arrows: true,
            // nextArrow: $('#nextTweet'),
            // prevArrow: $('#prevTweet'),
            responsive: [
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 2,
                  infinite: true,
                  dots: true
                }
              },
              {
                breakpoint: 600,
                settings: {
                  dots: false,
                  slidesToShow: 1,
                  slidesToScroll: 1
                }
              },
              // {
              //   breakpoint: 480,
              //   settings: {
              //     dots: false,
              //     slidesToShow: 1,
              //     slidesToScroll: 1
              //   }
              // }
            ]
          });
        },
        error: function(result) {
          console.error('😲 Uh oh, something\'s wrong with the tweet fetching code. Have your developer take a look.');
        }
      });
    } else {
      // console.log("No twitter carousel on this page.");
    }
});
