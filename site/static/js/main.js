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

// Counter

