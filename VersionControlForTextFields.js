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
                .before($(this)); 
            $(this).find('a:first').addClass('ui-state-active');
        });
        
        // iterate through history-enabled fields to add a revision toggle
        $('.ui-widget-header.with-history, .InputfieldHeader.with-history').each(function() {
            var toggle_class = "field-revisions-toggle";
            var toggle_title = "";
            if ($(this).siblings('.field-revisions').find('li').length < 1) {
                toggle_class += " inactive";
                toggle_title = " title='"+$(this).siblings('.field-revisions').text()+"'";
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
            var $content = $if.find('div.ui-widget-content, .InputfieldContent');
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
                    } else if ($if.find('.InputfieldCKEditorInline').length) {
                        // CKeditor inputfield in inline mode
                        $if.find('.InputfieldCKEditorInline').html(data);
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

        // hide revision list when user moves mouse cursor off it
        $('.field-revisions').bind('mouseleave', function() {
            $('.compare-revisions').remove();
            $(this).slideUp();
        });

        // if <ul> element containing revision history is long enough to get
        // vertical scrollbar, add some extra padding to compensate for it
        $('.field-revisions > ul').each(function() {
            // fetch DOM object matching current jQuery object (jQuery object
            // doesn't have clientHeight or scrollHeight which we need here)
            var dom_ul = $(this)[0];
            // to get correct heights parent element needs to be visible (this
            // should happen so fast that user never notices anything strange)
            $(this).parent().show();
            if (dom_ul.clientHeight < dom_ul.scrollHeight) {
                $(this).addClass('scroll');
            }
            $(this).parent().hide();
        });

        // when mouse cursor is moved on a revision link, show compare/diff
        // link, which -- when clicked -- loads a text diff for displaying
        // differences between selected revision and current revision.
        $('.field-revisions li > a').bind('hover', function() {
            $('.compare-revisions').remove();
            if (!$(this).hasClass('ui-state-active')) {
                // in this case r1 refers to current revision, r2 to selected
                // revision. diff is fetched as HTML from revision interface.
                var r1 = $(this).parents('.field-revisions:first').find('.ui-state-active').attr('data-revision');
                var r2 = $(this).attr('data-revision');
                var href = if_url+'diff/?revisions='+r1+':'+r2;
                // @todo: add support for translatable label text
                var label = "Compare with current";
                $(this).before('<div class="compare-revisions"><a class="diff-trigger" href="'+href+'">'+label+'</a></div>');
                $('.compare-revisions > a').bind('click', function() {
                    var $parent = $(this).parent();
                    var $loading = $('<span class="field-revisions-loading"></span>').hide().css({
                        height: $parent.innerHeight()+'px',
                        backgroundColor: $parent.css('background-color')
                    });
                    $parent.prepend($loading.fadeIn(250)).load($(this).attr('href'), function() {
                        $(this).find('a.diff-trigger').remove();
                        $(this).animate({
                            width: '400px',
                            padding: '14px'
                        });
                        $loading.fadeOut(350, function() {
                            $(this).remove();
                        });
                    });
                    return false;
                });
            }
        });
        
    });
    
});
