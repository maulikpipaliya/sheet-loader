$(document).on('ready', function(){
		$("ul li.hsub").on('click', function(){
			$("ul li.hsub").removeClass('hsubopen');
			$(this).addClass('hsubopen');
		})
})