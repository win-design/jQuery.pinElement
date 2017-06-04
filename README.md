# jquery.pinElement
Pin any element within a container . for examples go to http://anaslaksyby.com/pinElement.

# Usage

## 1. Load jQuery and include pinElement plugin file
To use pinElement, you’ll need to make sure both the pinElement and jQuery 1.7 or higher scripts are included.
```html
  <!--  jQuery  -->
  <script src="jquery-1.9.1.min.js"></script>
  <!--  Include pinElement plugin  -->
  <script src="js/jquery.pinElement.min.js"></script>
```

## 2. Set up your HTML
You don't need any special markup. All you need is to wrap your divs inside the container for example #pinElementContainer and add class to your div for example .pinElement . read the code comments.
```html
<!-- container with id -->
<div class="container" id="pinElementContainer">
<!-- if you don't use bootstrap.css make sure to add [position:relative] if div parent have float property.  -->
	<div class="col-sm-4">
	<!-- box you want to pin inside [id="pinElementContainer"] have class or id -->
		<div class="pinElement">
			<h2 class="headColor">Example box</h2>
			<p>some text</p>
		</div>
	</div>
	
	<div class="col-sm-8">
		<h2 class="headColor">Example box</h2>
		<p>some text</p>
	</div>
</div>
```

## 3. Call the plugin
To make a pinned element stay within an outer container, use the Container option
```js
$(document).ready(function() {
 
	$(".pinElement").pinElement({
		Top : '50px',
		Container : '#pinElementContainer',
	});
 
});
```

## Call the plugin with options
```js
$(document).ready(function() {
 
	$(".pinElement").pinElement({
		//default 0px
		Top : '50px',
		//default '.container' 
		Container : '#pinElementContainer',
		//default 20 
		ZIndex : 20,
		//default '767px' if you disable pinElement in mobile or tablet
		MinWidth : '767px',
		//events if scrolled or window resized  
		Events : function(e){
			console.log(e);
			// e.current => current scroll top [number]
			// e.direction => scroll down or up [up,down]
			// e.width => window width [number]
			// e.active => if pinElement active [true,false]
			// e.disabled => if window width < MinWidth pinElement will disabled [true, false]
		}
	});
 
});
```

## Reload trigger
```js
$(document).ready(function() {
 
	$(".pinElement").trigger('pinElement.reload');
 
});
```

## Examples

examples [Here](http://anaslaksyby.com/pinElement/).


# Changelog:

### 1.1.0
* added `pinElement.reload` trigger 
* resolved height if the parent height changed 
* resolved position if resize or reload page and scroll top  > 0



## The MIT License (MIT)

Copyright (c) 2017 Anas Laksyby

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

