$(function() {

      var $pages_id = $('#PageIDIndicator').text();
      var if_url = '../../setup/revision-history-for-text-fields/';
      $.get(if_url, {pages_id: $pages_id}, function(data) {

          $('body').prepend(data);

          $('#text-field-history > div').each(function() {
              var $field = $(this).attr('data-field');
              var $header = $('.ui-widget-header[for=Inputfield_'+$field+']');
              $header.append($(this)).addClass('with-history');
              $(this).find('li:odd').addClass('parity-odd');
          });

          $('.ui-widget-header.with-history').each(function() {
              $(this).find('.field-revision-toggle:first').addClass('active');
              var $revisions_toggle = '<a class="field-revisions-toggle"><span class="ui-icon ui-icon-clock"></span></a>';
              if ($(this).find('.ui-icon').length) {
                  $(this).find('.ui-icon').after($revisions_toggle);
              } else {
                  $(this).prepend($revisions_toggle);
              }
          });

          $('.field-revision-toggle').on('click', function() {
              $this = $(this);
              if ($this.hasClass('active')) return false;
              $this.parents('li.Inputfield:first').find('.field-revision-toggle.active').removeClass('active');
              $this.addClass('active');
              var $field = $this.attr('data-field');
              var $row_id = $this.attr('data-row-id');
              $this.parents('li.Inputfield:first').find('.ui-widget-content').css('opacity', '0.25');
              $.get(if_url+'get', {id: $row_id}, function(data) {
                  if (tinyMCE && tinyMCE.get('Inputfield_'+$field)) {
                      tinyMCE.get('Inputfield_'+$field).setContent(data);
                  } else if ($this.parents('li.Inputfield:first').find('textarea').length) {
                      $this.parents('li.Inputfield:first').find('textarea').html(data);
                  } else {
                      $this.parents('li.Inputfield:first').find('input[type=text]').val(data);
                  }
                  $this.parents('li.Inputfield:first').find('.ui-widget-content').animate({
                      opacity: 1
                  }, 500);
              });
              return false;
          });

          $('.field-revisions-toggle').on('click mouseenter', function() {
              $revisions = $(this).siblings('.field-revisions');
              var show = ($revisions.is(':visible')) ? false : true;
              $('.field-revisions').slideUp();
              if (show) $revisions.slideDown();
              return false;
          });

          $('.field-revisions')
              .on('mouseleave', function() {
                  $(this).slideUp();
              })
              .each(function() {
                  if ($(this).height() > 350) {
                      $(this).children().css('padding-right', '26px');
                  } else console.log($(this).height());
              });

      });

});
