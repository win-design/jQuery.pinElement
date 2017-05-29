/**
 * @version		1.1.0
 * @author		Anas Laksyby
 * @copyright		2017 (c) jquery.pinElement
 * @license		MIT License
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2017 Anas Laksyby
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
if (typeof Object.create !== 'function') {
	Object.create = function (obj) {
        "use strict";
		function F() {}
		F.prototype = obj;
		return new F();
	};
}

(function ($, window, document, undefined) {
	"use strict";
	var pinElement = {
		Scroll : {},
		Window : {},
		init : function (elem, options, elements) {
			this.opt = $.extend( {}, $.fn.pinElement.defaults, options );
			this.elem = elem;
			//some property we need to perpare element css style
			this.Prepare(elem);
			//if scroll do the action
			this.OnScroll(elem);
			this.OnResize(elem);
			var self = this;
			//fix Height and fix show pinElement if scroll top > 0
			setTimeout(function() {
				for (var i = elements.length - 1; i >= 0; i--) {
					self.fixContainerHeight(elements[i]);
				}
				$(window).trigger('scroll');
			}, 1000);
			$(elem).on('pinElement.reload', function(){
				self.Reload(elem);
			});
		},

		Prepare : function (elem) {
			var $this = $(elem), Container = {}, BoxParent = {}, Css = {};
			var data = this.ExtractData($this),self = this;
			var opt = data.pinElementOptions || (this.opt || {});
			//------------------------------------------------------------
			if(opt.Disabled === false){
				if (!$this.parent().is(".pinElement-wrapper")) {
	                $this.wrap("<div class='pinElement-wrapper'>");
	                $this.parent().css({'position':'relative'});
	            }
	            //Container object
	            var $container = $this.closest(opt.Container);
	            var ContainerOffset = $container.offset();
	            Container.top = ContainerOffset.top;
	            Container.left = ContainerOffset.left;
				Container.width = $container.width();
				Container.height = $container.height();
				//Parent Warp object
				var parentOffset = $this.offsetParent().offset();
	            BoxParent.top = parentOffset.top;
	            BoxParent.left = parentOffset.left;
				$this.parent().css("height", $this.outerHeight());
	            //Box
	            Css.width = $this.outerWidth();
				Css.position = 'fixed';
				Css.left = parseFloat(BoxParent.left)  ;
				Css.top = opt.Top;
				Css['z-index'] = opt.ZIndex;
				//save data
				$this.data('pinElement', JSON.stringify(Css))
					.data('pinElementOptions', JSON.stringify(opt))
					.data('pinElementParent', JSON.stringify(BoxParent))
					.data('pinElementContainer', JSON.stringify(Container));
			}
		},
		ExtractData : function ($this) {
			var data = {};
			var dpinElement = $this.data('pinElement') || {};
			var dBoxOpt = $this.data('pinElementOptions') || {};
			var dBoxParent = $this.data('pinElementParent') || {};
			var dBoxContainer = $this.data('pinElementContainer') || {};

			if (typeof  dpinElement === 'string') {
		        data.pinElement = JSON.parse( dpinElement );
		    }
		    if (typeof  dBoxOpt === 'string') {
		        data.pinElementOptions = JSON.parse( dBoxOpt );
		    }
		    if (typeof  dBoxParent === 'string') {
		        data.pinElementParent = JSON.parse( dBoxParent );
		    }
		    if (typeof  dBoxContainer === 'string') {
		        data.pinElementContainer = JSON.parse( dBoxContainer );
		    }
		    return data;
		},
		OnScroll : function (elem) {
			var self = this;
			$(window).scroll(function () {
                var $box = $(elem);
            	var $ScrollTop = $(this).scrollTop();
                var data = self.ExtractData($box);
            	var dpinElement = data.pinElement;
            	var BoxOpt = data.pinElementOptions;
            	var BoxParent = data.pinElementParent;
            	var BoxContainer = data.pinElementContainer;
            	//check if scroll up or down 
            	self.Scroll.direction = ($ScrollTop > self.Scroll.current) ? 'down': 'up';
            	self.Scroll.current = $ScrollTop;
            	self.Window.width = window.innerWidth || $(window).width();

                if($ScrollTop > (BoxContainer.top - parseInt(BoxOpt.Top)) && self.Window.width > parseInt(BoxOpt.MinWidth)){
                	BoxOpt.Disabled = false;

                	//end fixed 
                	var elemTop = $box.closest(BoxOpt.Container).height() - $box.outerHeight();
                	var totalTop = ((BoxParent.top || BoxContainer.top) + elemTop) - parseInt(BoxOpt.Top); 
                    if($ScrollTop > totalTop){
                    	$box.attr('style','').css({
                    		'width' : dpinElement.width,
                    		'position' : 'absolute',
                    		'top' : elemTop,
                    	});
                    }else{
                    	$box.css( dpinElement );
                    }
                	self.CallEvents($box, true, BoxOpt.Disabled);
                }else{
                	if(self.Window.width <= parseInt(BoxOpt.MinWidth)){
	                	if(BoxOpt.Disabled === false){
	                		$box.attr('style','').unwrap('.pinElement-wrapper');
	                		BoxOpt.Disabled = true;
	                	}
                	}else{
                		$box.attr('style','').css({width:dpinElement.width});
                	}
	                self.CallEvents($box, false, BoxOpt.Disabled);
                }
                $box.data('pinElementOptions', JSON.stringify(BoxOpt));
            });
		},
		OnResize : function (elem) {
			var self = this, $this = $(elem);
			$(window).resize(function() {
				var data = self.ExtractData($this);
            	var BoxOpt = data.pinElementOptions;
            	self.Window.width = window.innerWidth || $(window).width();
            	BoxOpt.Disabled = self.Window.width > parseInt(BoxOpt.MinWidth) ? false : true;
				if(BoxOpt.Disabled === false){
					var width = $this.parent().width();
					$this.attr('style','').css({width:width});
				}else{
					$this.attr('style','');
				}
				
				$this.data('pinElementOptions', JSON.stringify(BoxOpt));
				self.Prepare(elem);
				self.CallEvents($this, true, BoxOpt.Disabled);
				$(window).trigger('scroll');
			});
		},
		CallEvents : function(e, active, disabled){
			var self = this;
			active ? e.addClass('active') : e.removeClass('active');
			if (typeof self.opt.Events == 'function') {
				self.opt.Events.call(e, {
					current : self.Scroll.current,
					direction : self.Scroll.direction,
					width : self.Window.width,
					active : active,
					disabled : disabled
				});
			}
		},
		fixContainerHeight : function (elem) {
			var self = this, $this = $(elem);
			var data = self.ExtractData($this);
        	var BoxOpt = data.pinElementOptions;
        	var BoxParent = data.pinElementParent;
        	var BoxContainer = data.pinElementContainer;
			var $ScrollTop = $(window).scrollTop();
			var elemTop = $this.closest(BoxOpt.Container).height() - $this.outerHeight();
			var totalTop = ((BoxParent.top || BoxContainer.top) + elemTop) - parseInt(BoxOpt.Top);
			if($ScrollTop > totalTop){
				$this.attr('style','').css({
					'width' : data.pinElement.width,
					'position' : 'absolute',
					'top' : elemTop,
					'transition':'.3s'
				});
			}
		},
		Reload : function (elem) {
			var $this = $(elem);
			var width = $this.parent().width();
			$this.attr('style','').css({width:width});
			this.Prepare(elem);
		}
	};

	$.fn.pinElement = function (options) {
		var elements = [];
		var pinElement = Object.create( pinElement );
		return this.each(function() {
			elements.push(this);
			pinElement.init( this, options, elements );
		});
	};

	$.fn.pinElement.defaults = {
	    Container : '.container',
		Top : 0,
		ZIndex : 20,
		MinWidth : '767px',
		Events : false,
		Disabled : false,
		// Animation : true
	};

})(jQuery, window, document);
