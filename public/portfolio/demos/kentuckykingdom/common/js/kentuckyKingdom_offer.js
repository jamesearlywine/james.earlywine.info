/**
 * Javascript for the KentuckyKingdom offer.html page
 */
kentuckyKingdom_offer = {
    
    /**
     * Settings
     */
    settings : {
        // coupon url for printing
        couponURL           : 
            'couponsPrint/kk-ticket-print.jpg',
        endpoints : {
            apiKey: 'JfiBllpjReAzhaTgvHjyBGdLYeQCgpOvcxYYX1dV',
            iDidThis: 'backend/public/index.php/api/v1/iDidThis',
            iHeadAboutYouFrom: 'backend/public/index.php/api/v1/iHeardAboutYouFrom',
            sendEmail: 'backend/public/index.php/api/v1/sendEmail'
        },
        // social media settings.sharing
        sharing : {
            
            // social media network toggles
            facebook: true,
            twitter: true,
            //email: !window.is_android,
            email: false,
            linkedin: false,
            googleplus: true,
            pinterest: true,
            
            // data for all social media network posts
            link: 'http://digital.indystar.com/kentuckykingdom/offer.html',
            media: 'http://indylb-2135524474.us-east-1.elb.amazonaws.com/digital/production/kentuckykingdom/couponsShare/kk-ticket-share.jpg',
            title: 'IndyStar Exclusive Offer: Kentucky Kingdom Fun Pass',
            description: 'Two-Day Fun Pass only $29.95 - Buy first day and get second day FREE! An exclusive offer provided by IndyStar.',

            // facebook-only values
            caption: 'www.indystar.com',
            redirectUrl: 'http://digital.indystar.com/kentuckykingdom/close.html',
            
            // animation 
            position: 'bottom', // "left", "right", "top", "bottom"
            speed: 100,
            
            // debugging
            onOpen: function() {
                // console.log('share is open');
            },
            onClose: function() {
                // console.log('share is closed');
            }
            
        } // end settings.sharing   
            
    }, // end settings
    
    /**
     * @description     - Prints the coupon 
     *                  - (see this.settings.couponURL)
     */
    print: function() {
        // load the coupon
        this._loadCoupon(function() {
            // then print it
            setTimeout(function() {
                // append to html document (see style.css for relevant media queries) 
                $('html').append(this._coupon);
                // print it
                window.print();
            }.bind(this), 10);
        }.bind(this));
    }, // end print()
    
    /**
     * @description     - Creates an image element, 
     *                  - populates it with a coupon image
     *                  - assigns it to this._coupon
     *                  - calls the callback function after
     * @param function callback
     */
    _loadCoupon : function(callback) {
        // show loading animation?
        
        // create image element, store element handle to this._coupon
        this._coupon = $("<img/>")
            // what to do after image loads
            .load(callback) // callback (print) after it loads 
            // log if there is an error
            .error(function() { console.log("error loading image"); })
            // assign image source so that the image loads
            .attr("src", this.settings.couponURL)
            // this class hides from screen-view, show for print-view
            .addClass('printable-coupon')
        ;
    }, // end _loadCoupon()
    
    /**
     * @description     Initialize social media sharing 
     *                  (using Hideshare JS jquery library/extension)
     */
    initShare : function() {
        // initialize hideshare 
        // (button is on the page, with display:none)
        $(".share").hideshare(this.settings.sharing);
        // click that button to expand share options 
        // (in the inline modal content)
        setTimeout(function() {
            $('#share-button').trigger('click');
        }, 100);
    }, // end initShare()
    reportTheSource : function(formName) {
        var selector = '#' + formName + ' input[name="mediaType"]:checked';
        this.reportSource(
            $(selector).val()
        );
    },
    sourceConfirmed : function() {
        $('#mediaForm1, #mediaForm2')
            .addClass('not-displayed')
        ;
        $('.source-confirmation-message')
            .removeClass('not-displayed')
            .addClass('displayed')
        ;
    },
    reportSource : function(source) {
       
        $.ajax({
            method: 'POST',
            url: this.settings.endpoints.iHeadAboutYouFrom,
            data: {
                apiKey  : this.settings.endpoints.apiKey,
                source  : source
            },
            xhrFields: {
                withCredentials: true
            },
            success: function(data, status) {
                kentuckyKingdom_offer.sourceConfirmed();
            },
            error: function(data, status) {
                kentuckyKingdom_offer.sourceConfirmed();
            }
        });            
       
       
    },
    reportAction : function(action) {

        $.ajax({
            method: 'POST',
            url: this.settings.endpoints.iDidThis,
            data: {
                apiKey  : this.settings.endpoints.apiKey,
                action  : action
            },
            xhrFields: {
                withCredentials: true
            }
        });       
       
       
    },
    initEmailFields : function() {
        //$('#yourEmail').val('');
        $('#friendEmail').val('');
        $('#message').val('');
        
        setTimeout(function() {
            if ($('#yourEmail').val().trim() !== '') {
                $('#friendEmail').focus();
            } else {
                $('#yourEmail').focus();
            }
        }, 500);
        
    },
    sendTheEmail : function() {
        // if the form fails validation
        if (!$('#emailForm').valid()) {
            // do nothing
            return false;
        }
        
        // otherwise..
        
        // collect the email data
        var from = $('#emailForm #yourEmail').val();
        var to   = $('#emailForm #friendEmail').val();
        var body = $('#emailForm #message').val();
        
        // submit it to our server to send the email
        this.sendEmail(from, to, body);
        // remove the form from the modal
        $('.modal-body #emailForm').addClass('not-displayed');
        // append the confirmation message to the modal
        $('.modal-body .email-confirmation-message').removeClass('not-displayed')
        // close the modal after delay
        setTimeout(function() {
            $('button.close').click();
            // restore the email form
            setTimeout(function() {
                $('.modal-body .email-confirmation-message').addClass('not-displayed')
                $('.modal-body #emailForm').removeClass('not-displayed');
            }, 1500);
        }, 1500);
        
    },
    sendEmail : function(from, to, body) {
        
        $.ajax({
            method: 'POST',
            url: this.settings.endpoints.sendEmail,
            data: {
                apiKey  : this.settings.endpoints.apiKey,
                from    : from,
                to      : to,
                body    : body
            },
            xhrFields: {
                withCredentials: true
            }
        });

    }
    
};

// initialize share functionality
kentuckyKingdom_offer.initShare();
