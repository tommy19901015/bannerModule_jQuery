(function($) {
    'use strict';
    
        var ModuleName = 'banner';
    
        var Module = function ( ele, options ) {
            this.ele = ele;
            this.$ele = $(ele);
            $(ele).data('dom',$(ele)).data('options',options);
        };

        Module.DEFAULTS = {
         openAtStart: true, // [boolean] true | false
         // 設定啟動後是否要自動開或合，若設為false，就不要自勳開合；若為true是馬上自動開合；若為數字是幾毫秒之後開合
         autoToggle: false, // [boolean|number] true | false | 3000
         // 設定收合展開按鈕
            button: {
                closeText: '收合', // [string]
                openText: '展開', // [string]
                class: 'btn' // [string]
            },
            // 設定模組在各狀態時的class
            class: {
                closed: 'closed', // [string]
                closing: 'closing', // [string]
                opened: 'opened', // [string]
                opening: 'opening' // [string]
            },
            // 是否要有transition效果
            transition: true,
            // 當有transition時，要執行的callback function
            whenTransition: function() {
                console.log('whenTransition');
            }
        };
    
        Module.prototype.init = function(options){
            var $banner = this.$ele;
            this.initBanner();
            this.initBtn();
            this.clickBtn();
            this.autoToggle (options.autoToggle);
        }

        Module.prototype.autoToggle = function(autoToggle){        
            var $banner = this.$ele,
                options = $banner.data('options'),
                $btn = $banner.data('dom').find('.' + $banner.data('options').button.class);
            if(typeof autoToggle === 'number'){
                setTimeout(function(){ $btn.click(); }, autoToggle);            
            }else{
                autoToggle ? $btn.click() : '';      
            }
        }

        Module.prototype.initBanner = function(){
            var $banner = this.$ele,
                options = $banner.data('options');    
            options.openAtStart ? $banner.toggleClass(options.class.opened) 
            : $banner.toggleClass(options.class.closed);
        }

        Module.prototype.initBtn = function(){
            var $banner = this.$ele,
            options = $banner.data('options'),
            $btn = $banner.data('dom').find('.' + $banner.data('options').button.class);            
            $btn.addClass(options.class);
            ($banner.hasClass(options.class.opened)) ? $btn.text(options.button.closeText) : $btn.text(options.button.openText);
        }

        Module.prototype.clickBtn = function(){
            var $banner = this.$ele,
            options = $banner.data('options'),
            $btn = $banner.data('dom').find('.' + $banner.data('options').button.class);            
                
            $btn.click(function(){
                if($banner.data('options').transition){
                    Module.prototype.transitionBanner($banner)
                }else{
                    if($banner.hasClass(options.class.opened)){
                        $banner.removeClass(options.class.opened).addClass(options.class.closed);
                        $btn.text(options.button.openText);
                    }else{
                        $banner.removeClass(options.class.closed).addClass(options.class.opened);
                        $btn.text(options.button.closeText);
                    }
                }
            })
        }

        Module.prototype.transitionBanner = function($banner){
            $banner.off();
            var options = $banner.data('options'),
            $btn = $banner.data('dom').find('.' + $banner.data('options').button.class),
            flag = $banner.attr('class').split('banner ')[1],
            opened = options.class.opened,
            closed = options.class.closed,
            opening = options.class.opening,
            closing = options.class.closing,
            timer = null; 
            
            if(flag === opened){
                $banner.removeClass(opened).addClass(closing);
            }else{
                $banner.removeClass(closed).addClass(opening);
            }
            
            $banner.on('transitionrun', function() {
                timer = setInterval(function() {
                    $btn.attr('disabled', true); 
                    Module.DEFAULTS.whenTransition();
                  }, 100);
            }).on('transitionend', function() { 
                $btn.attr('disabled', false);         
                console.log('Transition End');
                clearInterval(timer);
                if($banner.hasClass(closing)){
                    $banner.removeClass(closing).addClass(closed);
                    $btn.text(options.button.openText);
                }else{
                    $banner.removeClass(opening).addClass(opened);
                    $btn.text(options.button.closeText);
                }
            });
        }

        Module.prototype.close = function(){
            var $banner = this.$ele,
            options = $banner.data('options'),
            $btn = $banner.data('dom').find('.' + $banner.data('options').button.class);            
            if(!$banner.hasClass(options.class.closed)) $btn.click();
        }

        Module.prototype.open = function(){
            var $banner = this.$ele,
            options = $banner.data('options'),
            $btn = $banner.data('dom').find('.' + $banner.data('options').button.class);            
            if(!$banner.hasClass(options.class.opened)) $btn.click();
        }

        Module.prototype.toggle = function(){
            var $banner = this.$ele,
            $btn = $banner.data('dom').find('.' + $banner.data('options').button.class);            
            $btn.click();
        }        

        $.fn[ModuleName] = function ( methods, options ) {
            return this.each(function(){
                var $this = $(this);
                var module = $this.data( ModuleName );
                var opts = null;
                if ( !!module ) {
                    if ( typeof methods === 'string' &&  typeof options === 'undefined' ) {                                            
                        try {
                            module[methods]();
                          }
                          catch(err) {
                            console.log('unsupported methods!');
                          }
                    } else if ( typeof methods === 'string' &&  typeof options === 'object' ) {                        
                        module[methods](options);
                    } else {
                        console.log('unsupported methods!');
                        throw 'unsupported methods!';
                    }
                } else {
                    opts = $.extend( true, Module.DEFAULTS, ( typeof methods === 'object' && options ), ( typeof options === 'object' && options ) );
                    module = new Module(this, opts);
                    $this.data( ModuleName, module );
                    module.init(opts);                    
                }
            });
        };
    
    })(jQuery);