$(function() {

    // variables; current page ID, revisions interface URL, additional settings
    var pages_id = $('#PageIDIndicator').text();
    var if_url = config.urls.admin+'setup/revision-history-for-text-fields/';
    var settings = { empty: true, render: 'HTML' };

    // fetch revision data for this page as HTML markup
    $.get(if_url, { pages_id: pages_id, settings: settings }, function(data) {
        
        // prepend data (#text-field-history) to body
        $('body').prepend(data);

        // iterate through field specific revision containers and add their
        // contents to that fields header (.ui-widget-header) only if they
        // contain at least one revision other than what's currently used
        $('#text-field-history > div').each(function() {
            $('.Inputfield_'+$(this).attr('data-field')+' > label')
                .addClass('with-history')
                .after($(this));
            $(this).find('a:first').addClass('ui-state-active');
        });
        
        // iterate through history-enabled fields to add a revision toggle
        $('.ui-widget-header.with-history').each(function() {
            var toggle_class = "field-revisions-toggle";
            var toggle_title = "";
            if ($(this).next('.field-revisions').find('li').length < 1) {
                toggle_class += " inactive";
                toggle_title = " title='"+$(this).next('.field-revisions').text()+"'";
            }
            var revisions_toggle = '<a '+toggle_title+'class="'+toggle_class+'"><span class="ui-icon ui-icon-clock"></span></a>';
            if ($(this).find('.ui-icon').length) {
                $(this).find('.ui-icon').after(revisions_toggle);
            } else {
                $(this).prepend(revisions_toggle);
            }
        });
        
        // when a link in revision list is clicked, fetch data for appropriate
        // revision from the interface (most of the code here is realted to how
        // things are presented, loading animation etc.)
        $('.field-revisions a').bind('click', function() {
            if ($(this).hasClass('ui-state-active')) return false;
            var $this = $(this);
            var $if = $this.parents('.Inputfield:first');
            var field = $this.parents('.field-revisions:first').attr('data-field');
            $if.find('.field-revisions .ui-state-active').removeClass('ui-state-active');
            $this.addClass('ui-state-active');
            var $content = $if.find('div.ui-widget-content');
            var $loading = $('<span class="field-revisions-loading"></span>').hide().css({
                height: $content.innerHeight()+'px',
                backgroundColor: $content.css('background-color')
            });
            if ($if.hasClass('InputfieldDatetime')) {
                // datetime inputfield has <p> tag around it from which we must
                // remove margin-top here to to avoid odd (Webkit) CSS quirk
                // (ProcessWire commit 2298dc0035751ad940cac48fd2a1129585c9581f
                // removes said tag, but older versions still need this fix)
                $content.find('input:first').parent('p').css('margin-top', 0);
            }
            $content.css('position', 'relative').prepend($loading.fadeIn(250));
            $.get(if_url+'get', {id: $this.attr('data-revision')}, function(json) {
                $.each(json, function(property, data) {
                    var language = property.replace('data', '');
                    if (language) language = "__"+language;
                    if (typeof tinyMCE != "undefined" && tinyMCE.get('Inputfield_'+field+language)) {
                        // TinyMCE inputfield
                        tinyMCE.get('Inputfield_'+field+language).setContent(data);
                    } else if (typeof CKEDITOR != "undefined" && CKEDITOR.instances['Inputfield_'+field+language]) {
                        // CKEditor inputfield
                        CKEDITOR.instances['Inputfield_'+field+language].setData(data);
                    } else if ($if.find('textarea').length) {
                        // Textarea inputfield (or any other inputfield using
                        // <textarea> HTML element)
                        $if.find('textarea[name='+field+language+']').html(data);
                    } else {
                        // Text inputfield (or any other inputfield using
                        // <input> HTML element)
                        $input = $if.find('input[name='+field+language+']');
                        if ($input.hasClass('hasDatepicker')) $input.datepicker("setDate", new Date(data));
                        else $input.val(data);
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
            if ($(this).hasClass('inactive')) return false;
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
