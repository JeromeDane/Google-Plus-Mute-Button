// ==UserScript==
// @name           Google+ Tweaks
// @description    Tweaks to the layout and features of Google+
// @author         Jerome Dane
// @website        http://userscripts.org/scripts/show/106166
// @version        1.1157
//
// @updateURL      https://userscripts.org/scripts/source/106166.meta.js
// 
// @include        http://plus.google.com/*
// @include        https://plus.google.com/*
//
// ==/UserScript==

// License         Creative Commons Attribution 3.0 Unported License http://creativecommons.org/licenses/by/3.0/
//
// Copyright (c) 2012 Jerome Dane
//
// Permission is hereby granted, free of charge, to any person obtaining 
// a copy of this software and associated documentation files (the "Software"), 
// to deal in the Software without restriction, including without limitation the 
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
// sell copies of the Software, and to permit persons to whom the Software is 
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all 
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
// CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
// OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

function simulateClick(element) {
    var clickEvent;
    clickEvent = document.createEvent("MouseEvents")
    clickEvent.initEvent("mousedown", true, true)
    element.dispatchEvent(clickEvent);
    
    clickEvent = document.createEvent("MouseEvents")
    clickEvent.initEvent("click", true, true)
    element.dispatchEvent(clickEvent);
    
    clickEvent = document.createEvent("MouseEvents")
    clickEvent.initEvent("mouseup", true, true)
    element.dispatchEvent(clickEvent);
}

// inject styles
$('head').append('<style type="text/css">.muteButton {' +
	'border: 1px solid #C6C6C6;' +
	'background:url(https://lh3.googleusercontent.com/-lZDyA7RaVHQ/Thw6SRRp-lI/AAAAAAAAAI0/qRIid0xFWJs/sound_mute_desaturated.png) center no-repeat;' +
	'padding:1px 15px; opacity:.5;' +
	'cursor:pointer;' +
	'position:absolute; right:43px; top:11px; border:1px solid #aaa; border-radius:2px; }' +
	'.muteButton:hover { opacity:1;' +
		'background-image:url(https://lh4.googleusercontent.com/-5NYOXadhJOs/Thw5O1SYBoI/AAAAAAAAAIs/zOvmkFAcrks/ound_mute.png); background-color:#eee;' +
	'}' +
	'</style>');

// get your own name
var myName = $('#gbi4t').text(); 

function injectMuteButton(postElem) {
	
	if(!postElem.className.match(/muteButtonEnabled/)) {
		
		var posterName = $('h3 a[oid]', postElem).text();
		
		if(posterName != myName) {
			
			
			postElem.className += ' muteButtonEnabled';
			
			// don't add mute buttons to your own posts
			
			var menuButton = $('span[role="button"]', postElem)[0];
			
			// insert mute button
			var muteButton = $(menuButton).before('<div class="muteButton" title="Mute this post">&nbsp;</div>');
			
			// bind mute button click event
			$('.muteButton', postElem).click(function() {
				
				// open and get the menu
				simulateClick(menuButton);
				var menu = $('div[role="menu"]', postElem);
				
				var muted = false
				
				function _clickMuteItem(elem) {
					simulateClick(elem);
					muted = true;
					$(postElem).remove();
				}
				
				var menuItems = $('div[role="menuitem"]', menu);
				
				// try to find "Mute" for English users (the easy way)
				menuItems.each(function() {
					if(this.innerHTML.match(/Mute/)) {
						_clickMuteItem(this);
					}
				});
				
				// try to find the mute button based on position in list if the word "Mute" wasn't found (the hard way)
				if(!muted) {
					switch(menuItems.size()) {
						case 4:
						case 5:
							_clickMuteItem(menuItems[1]);
							break;
					} 
				}
			});
		}
	}
};

// bind mouseover for current and any new posts 
$('div[id^="update-"]').live('mouseover', function() {
	injectMuteButton(this);
	$('.muteButton', this).show();
});
// bind mouseout for current and any new posts 
$('div[id^="update-"]').live('mouseout', function() {
	$('.muteButton', this).hide();
});