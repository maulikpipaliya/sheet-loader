$(document).on('ready', function(){
		/*$("ul li.hsub").on('click', function(){
			$("ul li.hsub").removeClass('hsubopen');
			$(this).addClass('hsubopen');
		})


		$('.grid').isotope({
	        itemSelector: '.grid-item',
	        percentPosition: true,
	        masonry: {
	          columnWidth: '.grid-sizer',
	          gutter: 25
	        }
	    })

	    $('.prewrap').on({
	        mouseenter: function () {
	            $(this).addClass('wrap');
	        },
	        mouseleave: function () {
	            $(this).removeClass('wrap');
	        }
	    })

	    $('.owl-testimoni').owlCarousel({
		    loop:true,
		    margin:10,
		    responsiveClass:true,
		    paging: true,
		    autoplay: true,
		    responsive:{
		        0:{
		            items:1,
		            nav:false
		        },
		        600:{
		            items:1,
		            nav:false
		        },
		        1000:{
		            items:1,
		            nav:false,
		            loop:true
		        }
		    }
		})*/

		/*var radiosingle = $("#singlechecked").is(':checked');

		if (radiosingle == true){
			$('.wraplisttable').addClass('wraplisttableopen');
		}else{
			$('.wraplisttable').removeClass('wraplisttableopen');
		}*/

		$('input[type=radio]').on('change', function(){
			if ($(this).val() == 'In Single Table'){
				$('.wraplisttable').addClass('wraplisttableopen');
			}else{
				$('.wraplisttable').removeClass('wraplisttableopen');
			}
		})

		$('input[type=radio]#singlechecked').is(':checked');

		// Setup navigation fix top when scroll
	    /*$(window).on('scroll', function (e) {    
	        var scroll = $(window).scrollTop();
	        var winheight = '200';
	        var classwrapnav = $('.header');
	        if (scroll > winheight) {
	            classwrapnav.addClass('fixtop');
	        }else{
	            classwrapnav.removeClass('fixtop');
	        }   
	    })

	    $(".header .burgermenu").on('click', function(){
	    	$(this).toggleClass('bmenuopen');
	    	$('.header ul').toggleClass('navopen');
	    	return false;
	    })*/
})