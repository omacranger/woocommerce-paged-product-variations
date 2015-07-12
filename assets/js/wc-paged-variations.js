(function( root, $, undefined ) {
    "use strict";

    $(function () {

        // Default blockUI settings
        window.blockui_settings = {
            message: null,
            overlayCSS: {
                background: '#fff',
                opacity: 0.6
            }
        };

        // Generate paged toolbars
        add_toolbars();

        // Set the page number global
        woocommerce_admin_meta_boxes_variations.page_number = 0;

        // Add the default page
        add_variation( 1 );

    });
    /**
     * Used to return the variations for page_number
     * @param page_number
     */
    function add_variation( page_number ){
        var variations_wrapper = $(".woocommerce_variations");

        variations_wrapper.block(window.blockui_settings);

        woocommerce_admin_meta_boxes_variations.page_number = page_number;


        var data = {
            action: 'woocommerce_paged_get_variations',
            post_id: woocommerce_admin_meta_boxes_variations.post_id,
            security: woocommerce_admin_meta_boxes_variations.add_variation_nonce,
            page_number: page_number
        };

        $.post( woocommerce_admin_meta_boxes_variations.ajax_url, data, function ( response ) {

            variations_wrapper.empty();

            variations_wrapper.append( response );
            $( '#variable_product_options' ).trigger( 'woocommerce_variations_added' );

            $('#variable_product_options .close_all').click();

            variations_wrapper.unblock();
        });
    }

    /**
     * Function to add the default toolbars for the paged variation plugins
     */
    function add_toolbars(){
        var variations_wrapper = $(".woocommerce_variations");

        variations_wrapper.after( '<p class="toolbar variation_pages"></p>' );

        var paged_toolbar = $( '.toolbar.variation_pages' );

        // Get number of pages and populate toolbar
        var data = {
            action: 'woocommerce_paged_get_pages',
            post_id: woocommerce_admin_meta_boxes_variations.post_id,
            security: woocommerce_admin_meta_boxes_variations.add_variation_nonce
        };

        $.post( woocommerce_admin_meta_boxes_variations.ajax_url, data, function ( response ) {

            // console.log(response);

            for(var x = 1; x < parseInt(response); x++){
                var primary_class = "";
                if(x == 1) primary_class = "button-primary";
                paged_toolbar.append( '<button type="button" class="button ' + primary_class + ' page_number" data-page_number="'+x+'">' + x + '</button>' );
            }

            paged_toolbar.find('.page_number').on( 'click' , function(){
                paged_toolbar.find('.page_number').removeClass('button-primary');
                add_variation( $(this).data('page_number') );
                $(this).addClass('button-primary');
            } );

        });

    }

} ( this, jQuery ));