$(document).ready(function() {
    //----- MODAL -----
    var initialScrollPosition = $(document).scrollTop();
    var modalScrollPosition;
    
    $('#btn-open-modal').click(function() {
        modalScrollPosition = $(document).scrollTop();
        
        $('.modal-bg').addClass('modal-fade');
        $('.modal-container').addClass('modal-fade');
        $('.modal-container').css('top', modalScrollPosition);
        
        //disable scrolling
        $('body').addClass('no-scroll');
    });
    
    $('.modal-cancel').click(function() {
        closeModal();
    });
    
    $('.modal-bg').click(function() {
        closeModal();
    });
    
    function closeModal() {
        $('.modal-bg').removeClass('modal-fade');
        $('.modal-container').removeClass('modal-fade');
    
        //enable scrolling
        $('body').removeClass('no-scroll');
    }
    
    //----- MENU -----
    var isMenuOpen = false;
    
    $('#btn-toggle-menu').click(function() {
        isMenuOpen = !isMenuOpen;
    
        if(isMenuOpen) {  //if true
            $('#main-nav').addClass('menu-open');
        } else {
            $('#main-nav').removeClass('menu-open');
        }
    });
    
    //----- ACCORDION PANELS -----
    var isPanelOpen = false;
    
    $(".accordion-panel-toggle-button").click(function() {
        // determine target panel
        var thisTarget = "#" + $(this).data("target");
        
        // check if panel is already open
        var isPanelOpen = $(thisTarget).hasClass("panel-open");
        if(isPanelOpen) {  //if true 
            // remove class from target panel
            $(thisTarget).removeClass("panel-open");
            
            // switch the target's button icon
            $(this).children().removeClass('icon-up-dir');
            $(this).children().addClass('icon-down-dir');
        } else {
            // remove any and all classes that matches class name
            $('.panel-body-container').removeClass('panel-open');
            
            // switch any and all button icons
            $('.accordion-panel-toggle-button').children().removeClass('icon-up-dir');
            $('.accordion-panel-toggle-button').children().addClass('icon-down-dir');
            
            // add class to target panel only
            $(thisTarget).addClass("panel-open");
            
            // switch the target button's icon only
            $(this).children().removeClass('icon-down-dir');
            $(this).children().addClass('icon-up-dir');
            
            $( ".accordion-container").scrollTop(300);
        }
    });
});