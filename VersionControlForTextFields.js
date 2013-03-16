$(function() {

    // variables; ID of current page and URL for revisions interface (page)
    var pages_id = $('#PageIDIndicator').text();
    var if_url = config.urls.admin+'setup/revision-history-for-text-fields/';

    // fetch revision data for this page as HTML markup
    $.get(if_url, {pages_id: pages_id}, function(data) {
        
        // prepend data (#text-field-history) to body
        $('body').prepend(data);

        // iterate through field specific revision containers and add their
        // contents to that fields header (.ui-widget-header) only if they
        // contain at least one revision other than what's currently used
        $('#text-field-history > div').each(function() {
            if ($(this).find('li').length < 2) return;
            $('.ui-widget-header[for=Inputfield_'+$(this).attr('data-field')+']')
                .addClass('with-history')
                .after($(this));
            $(this).find('a:first').addClass('ui-state-active');
        });
        
        // iterate through history-enabled fields to add a revision toggle
        $('.ui-widget-header.with-history').each(function() {
            var $revisions_toggle = '<a class="field-revisions-toggle"><span class="ui-icon ui-icon-clock"></span></a>';
            if ($(this).find('.ui-icon').length) {
                $(this).find('.ui-icon').after($revisions_toggle);
            } else {
                $(this).prepend($revisions_toggle);
            }
        });
        
        // when a link in revision list is clicked, fetch data for appropriate
        // revision from the interface (most of the code here is realted to how
        // things are presented, loading animation etc.)
        $('.field-revisions a').bind('click', function() {
            if ($(this).hasClass('ui-state-active')) return false;
            var $this = $(this);
            var field = $this.parents('.field-revisions:first').attr('data-field');
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
                        // TinyMCE inputfield
                        tinyMCE.get('Inputfield_'+field+language).setContent(data);
                    } else if (typeof CKEDITOR != "undefined" && CKEDITOR.instances['Inputfield_'+field+language]) {
                        // CKEditor inputfield
                        CKEDITOR.instances['Inputfield_'+field+language].setData(data);
                    } else if ($this.parents('li.Inputfield:first').find('textarea').length) {
                        // Textarea inputfield (or any inputfield using a
                        // <textarea> HTML element)
                        $this.parents('li.Inputfield:first').find('textarea#Inputfield_'+field+language).html(data);
                    } else {
                        // Text inputfield (or any other inputfield using a
                        // <input> HTML element with type set to text)
                        $this.parents('li.Inputfield:first').find('input[type=text]#Inputfield_'+field+language).val(data);
                    }
                    $loading.fadeOut(350, function() {
                        $(this).remove();
                    });
                });
            });
            return false;
        });
        
        // when mouse cursor is moved on a revisions toggle (or it is clicked,
        // to make it accessible for touch devices etc.) show (or hide if it 
        // was already visible) revision list
        $('.field-revisions-toggle').bind('click mouseenter', function() {
            $revisions = $(this).parent('label').siblings('.field-revisions');
            var show = ($revisions.is(':visible')) ? false : true;
            $('.field-revisions').slideUp();
            if (show) $revisions.slideDown();
            return false;
        });

        // find out max-height given to revision lists at CSS file (this way
        // it's possible to change it's value at CSS level without having to
        // change any JavaScript code here..)
        var list_max_height = parseInt($('.field-revisions:first > ul').css('max-height'));

        $('.field-revisions')
            .bind('mouseleave', function() {
                // hide revision list when user moves mouse cursor off it
                $(this).slideUp();
            })
            .each(function() {
                if ($(this).height() > list_max_height) {
                    // extra padding to compensate for vertical scrollbar
                    $(this).children().css('padding-right', '26px');
                }
            });
        
    });
    
});
