$(function() {

      var pages_id = $('#PageIDIndicator').text();
      var if_url = config.urls.admin+'setup/revision-history-for-text-fields/';
      $.get(if_url, {pages_id: pages_id}, function(data) {

          $('body').prepend(data);

          $('#text-field-history > div').each(function() {
              if ($(this).find('li').length < 2) return;
              $('.ui-widget-header[for=Inputfield_'+$(this).attr('data-field')+']')
                  .addClass('with-history')
                  .after($(this));
              $(this).find('a:first').addClass('ui-state-active');
          });

          $('.ui-widget-header.with-history').each(function() {
              var $revisions_toggle = '<a class="field-revisions-toggle"><span class="ui-icon ui-icon-clock"></span></a>';
              if ($(this).find('.ui-icon').length) {
                  $(this).find('.ui-icon').after($revisions_toggle);
              } else {
                  $(this).prepend($revisions_toggle);
              }
          });

          $('.field-revisions a').bind('click', function() {
              if ($(this).hasClass('ui-state-active')) return false;
              var $this = $(this);
              var field = $this.attr('data-field');
              var revision = $this.attr('data-revision');
              $this.parents('li.Inputfield:first').find('.field-revisions .ui-state-active').removeClass('ui-state-active');
              $this.addClass('ui-state-active');
              var $content = $this.parents('li.Inputfield:first').find('div.ui-widget-content');
              var $loading = $('<span class="field-revisions-loading"></span>').hide().css({
                  height: $content.innerHeight()+'px',
                  backgroundColor: $content.css('background-color')
              });
              $content.css('position', 'relative').prepend($loading.fadeIn(250));
              $.get(if_url+'get', {id: revision}, function(json) {
                  $.each(json, function(property, data) {
                      var language = property.replace('data', '');
                      if (language) language = "__"+language;
                      if (tinyMCE && tinyMCE.get('Inputfield_'+field+language)) {
                          tinyMCE.get('Inputfield_'+field+language).setContent(data);
                      } else if ($this.parents('li.Inputfield:first').find('textarea').length) {
                          $this.parents('li.Inputfield:first').find('textarea#Inputfield_'+field+language).html(data);
                      } else {
                          $this.parents('li.Inputfield:first').find('input[type=text]#Inputfield_'+field+language).val(data);
                      }
                      $loading.fadeOut(350, function() {
                          $(this).remove();
                      });
                  });
              });
              return false;
          });

          $('.field-revisions-toggle').bind('click mouseenter', function() {
              $revisions = $(this).parent('label').siblings('.field-revisions');
              var show = ($revisions.is(':visible')) ? false : true;
              $('.field-revisions').slideUp();
              if (show) $revisions.slideDown();
              return false;
          });

          var list_max_height = parseInt($('.field-revisions:first > ul').css('max-height'));
          $('.field-revisions')
              .bind('mouseleave', function() {
                  $(this).slideUp();
              })
              .each(function() {
                  if ($(this).height() > list_max_height) {
                      $(this).children().css('padding-right', '26px');
                  }
              });

      });

});
