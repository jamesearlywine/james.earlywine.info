/*************************************
  expands and collapses a dropdown 
*************************************/

/* global $ */

$(document).ready(function() {
  $('.dropdown').click(function() {
    var target = $(this).attr("data-target");
    
    if($(target).hasClass('open')) {
      $(target).removeClass('open');
    } else {
      $(target).addClass('open');
    }
  });
});