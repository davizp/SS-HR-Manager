/*
// Common JS
// Date: November 2013
// Developers:
//  Adolfo Gutierrez - agutierrez@flukyfactory.com
//  Luis Matute      - lmatute@flukyfactory.com
// Description:
//  This is a simple boilerplate for plugins with requirejs
// ---------------------------------------------------------
*/

// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.
;define('pluginName', [], function(){

    // Defaults
        var pluginName = "pluginName",
            defaults = {
                someDefault: "Some Value"
            };

    // Plugin Constructor
        function Plugin( element, options ) {
            this.$el        = $(element);
            this._defaults  = defaults;
            this._name      = pluginName;

            // jQuery has an extend method that merges the
            // contents of two or more objects, storing the
            // result in the first object. The first object
            // is generally empty because we don't want to alter
            // the default options for future instances of the plugin
            this.options    = $.extend( {}, defaults, options); // Merging defaults with parametes received

            // Fire up the plugin
            this.init();
        }

    // Plugin methods
        Plugin.prototype = {
            init: function() {
                // Place initialization logic here
                // You already have access to the DOM element and
                // the options via the instance, e.g. this.$el
                // and this.options
                // you can add more functions like the one below and
                // call them like so: this.yourOtherFunction(this.$el, this.options).
                console.log("[" + this._name + "-plugin]: Initiated");
                console.log(this);
            },

            yourOtherFunction: function($el, options) {
                // some logic
            }
        };

    // First we check if we can access the plugin method, then we have
    // a really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations on the same element.
        $.fn[pluginName] = function ( options ) {

            if ( typeof options === 'string' ) {
                var args = Array.prototype.slice.call( arguments, 1 );

                this.each(function() {
                    var instance = $.data( this, pluginName );

                    if ( !instance ) {
                        console.error( "cannot call methods on " + pluginName + " prior to initialization; " +
                        "attempted to call method '" + options + "'" );
                        return;
                    }

                    if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
                        console.error( "no such method '" + options + "' for " + pluginName + " instance" );
                        return;
                    }

                    instance[ options ].apply( instance, args );
                });
            }
            else {
                this.each(function() {
                    var instance = $.data( this, pluginName );
                    if ( !instance ) {
                        $.data( this, pluginName, new Plugin( this, options ));
                    }
                });
            }

            return this;
        };
});