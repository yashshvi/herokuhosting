
$(function(){
    // alert('hello');
    if($('textarea#ta').length){
        CKEDITOR.replace('ta');
    }
    $('a.conform').on('click',function(){
        if(!confirm('confirm deletion'))
        return false
    })
    if ($("[data-fancybox]").length) {
		$("[data-fancybox]").fancybox();
	});
})