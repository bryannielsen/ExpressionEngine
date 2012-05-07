/*!
 * jQuery UI Draggable @VERSION
 *
 * Copyright 2012, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Draggables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */

(function(d){d.widget("ui.draggable",d.ui.mouse,{widgetEventPrefix:"drag",options:{addClasses:!0,appendTo:"parent",axis:!1,connectToSortable:!1,containment:!1,cursor:"auto",cursorAt:!1,grid:!1,handle:!1,helper:"original",iframeFix:!1,opacity:!1,refreshPositions:!1,revert:!1,revertDuration:500,scope:"default",scroll:!0,scrollSensitivity:20,scrollSpeed:20,snap:!1,snapMode:"both",snapTolerance:20,stack:!1,zIndex:!1},_create:function(){if(this.options.helper=="original"&&!/^(?:r|a|f)/.test(this.element.css("position")))this.element[0].style.position=
"relative";this.options.addClasses&&this.element.addClass("ui-draggable");this.options.disabled&&this.element.addClass("ui-draggable-disabled");this._mouseInit()},destroy:function(){if(this.element.data("draggable"))return this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"),this._mouseDestroy(),this},_mouseCapture:function(a){var c=this.options;if(this.helper||c.disabled||d(a.target).is(".ui-resizable-handle"))return!1;
this.handle=this._getHandle(a);if(!this.handle)return!1;c.iframeFix&&d(c.iframeFix===!0?"iframe":c.iframeFix).each(function(){d('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({width:this.offsetWidth+"px",height:this.offsetHeight+"px",position:"absolute",opacity:"0.001",zIndex:1E3}).css(d(this).offset()).appendTo("body")});return!0},_mouseStart:function(a){var c=this.options;this.helper=this._createHelper(a);this._cacheHelperProportions();if(d.ui.ddmanager)d.ui.ddmanager.current=
this;this._cacheMargins();this.cssPosition=this.helper.css("position");this.scrollParent=this.helper.scrollParent();this.offset=this.positionAbs=this.element.offset();this.offset={top:this.offset.top-this.margins.top,left:this.offset.left-this.margins.left};d.extend(this.offset,{click:{left:a.pageX-this.offset.left,top:a.pageY-this.offset.top},parent:this._getParentOffset(),relative:this._getRelativeOffset()});this.originalPosition=this.position=this._generatePosition(a);this.originalPageX=a.pageX;
this.originalPageY=a.pageY;c.cursorAt&&this._adjustOffsetFromHelper(c.cursorAt);c.containment&&this._setContainment();if(this._trigger("start",a)===!1)return this._clear(),!1;this._cacheHelperProportions();d.ui.ddmanager&&!c.dropBehaviour&&d.ui.ddmanager.prepareOffsets(this,a);this.helper.addClass("ui-draggable-dragging");this._mouseDrag(a,!0);d.ui.ddmanager&&d.ui.ddmanager.dragStart(this,a);return!0},_mouseDrag:function(a,c){this.position=this._generatePosition(a);this.positionAbs=this._convertPositionTo("absolute");
if(!c){var b=this._uiHash();if(this._trigger("drag",a,b)===!1)return this._mouseUp({}),!1;this.position=b.position}if(!this.options.axis||this.options.axis!="y")this.helper[0].style.left=this.position.left+"px";if(!this.options.axis||this.options.axis!="x")this.helper[0].style.top=this.position.top+"px";d.ui.ddmanager&&d.ui.ddmanager.drag(this,a);return!1},_mouseStop:function(a){var c=!1;d.ui.ddmanager&&!this.options.dropBehaviour&&(c=d.ui.ddmanager.drop(this,a));if(this.dropped)c=this.dropped,this.dropped=
!1;for(var b=this.element[0],f=!1;b&&(b=b.parentNode);)b==document&&(f=!0);if(!f&&this.options.helper==="original")return!1;if(this.options.revert=="invalid"&&!c||this.options.revert=="valid"&&c||this.options.revert===!0||d.isFunction(this.options.revert)&&this.options.revert.call(this.element,c)){var e=this;d(this.helper).animate(this.originalPosition,parseInt(this.options.revertDuration,10),function(){e._trigger("stop",a)!==!1&&e._clear()})}else this._trigger("stop",a)!==!1&&this._clear();return!1},
_mouseUp:function(a){this.options.iframeFix===!0&&d("div.ui-draggable-iframeFix").each(function(){this.parentNode.removeChild(this)});d.ui.ddmanager&&d.ui.ddmanager.dragStop(this,a);return d.ui.mouse.prototype._mouseUp.call(this,a)},cancel:function(){this.helper.is(".ui-draggable-dragging")?this._mouseUp({}):this._clear();return this},_getHandle:function(a){var c=!this.options.handle||!d(this.options.handle,this.element).length?!0:!1;d(this.options.handle,this.element).find("*").andSelf().each(function(){this==
a.target&&(c=!0)});return c},_createHelper:function(a){var c=this.options,a=d.isFunction(c.helper)?d(c.helper.apply(this.element[0],[a])):c.helper=="clone"?this.element.clone().removeAttr("id"):this.element;a.parents("body").length||a.appendTo(c.appendTo=="parent"?this.element[0].parentNode:c.appendTo);a[0]!=this.element[0]&&!/(fixed|absolute)/.test(a.css("position"))&&a.css("position","absolute");return a},_adjustOffsetFromHelper:function(a){typeof a=="string"&&(a=a.split(" "));d.isArray(a)&&(a=
{left:+a[0],top:+a[1]||0});if("left"in a)this.offset.click.left=a.left+this.margins.left;if("right"in a)this.offset.click.left=this.helperProportions.width-a.right+this.margins.left;if("top"in a)this.offset.click.top=a.top+this.margins.top;if("bottom"in a)this.offset.click.top=this.helperProportions.height-a.bottom+this.margins.top},_getParentOffset:function(){this.offsetParent=this.helper.offsetParent();var a=this.offsetParent.offset();this.cssPosition=="absolute"&&this.scrollParent[0]!=document&&
d.ui.contains(this.scrollParent[0],this.offsetParent[0])&&(a.left+=this.scrollParent.scrollLeft(),a.top+=this.scrollParent.scrollTop());if(this.offsetParent[0]==document.body||this.offsetParent[0].tagName&&this.offsetParent[0].tagName.toLowerCase()=="html"&&d.browser.msie)a={top:0,left:0};return{top:a.top+(parseInt(this.offsetParent.css("borderTopWidth"),10)||0),left:a.left+(parseInt(this.offsetParent.css("borderLeftWidth"),10)||0)}},_getRelativeOffset:function(){if(this.cssPosition=="relative"){var a=
this.element.position();return{top:a.top-(parseInt(this.helper.css("top"),10)||0)+this.scrollParent.scrollTop(),left:a.left-(parseInt(this.helper.css("left"),10)||0)+this.scrollParent.scrollLeft()}}else return{top:0,left:0}},_cacheMargins:function(){this.margins={left:parseInt(this.element.css("marginLeft"),10)||0,top:parseInt(this.element.css("marginTop"),10)||0,right:parseInt(this.element.css("marginRight"),10)||0,bottom:parseInt(this.element.css("marginBottom"),10)||0}},_cacheHelperProportions:function(){this.helperProportions=
{width:this.helper.outerWidth(),height:this.helper.outerHeight()}},_setContainment:function(){var a=this.options;if(a.containment=="parent")a.containment=this.helper[0].parentNode;if(a.containment=="document"||a.containment=="window")this.containment=[a.containment=="document"?0:d(window).scrollLeft()-this.offset.relative.left-this.offset.parent.left,a.containment=="document"?0:d(window).scrollTop()-this.offset.relative.top-this.offset.parent.top,(a.containment=="document"?0:d(window).scrollLeft())+
d(a.containment=="document"?document:window).width()-this.helperProportions.width-this.margins.left,(a.containment=="document"?0:d(window).scrollTop())+(d(a.containment=="document"?document:window).height()||document.body.parentNode.scrollHeight)-this.helperProportions.height-this.margins.top];if(!/^(document|window|parent)$/.test(a.containment)&&a.containment.constructor!=Array){var a=d(a.containment),c=a[0];if(c){a.offset();var b=d(c).css("overflow")!="hidden";this.containment=[(parseInt(d(c).css("borderLeftWidth"),
10)||0)+(parseInt(d(c).css("paddingLeft"),10)||0),(parseInt(d(c).css("borderTopWidth"),10)||0)+(parseInt(d(c).css("paddingTop"),10)||0),(b?Math.max(c.scrollWidth,c.offsetWidth):c.offsetWidth)-(parseInt(d(c).css("borderLeftWidth"),10)||0)-(parseInt(d(c).css("paddingRight"),10)||0)-this.helperProportions.width-this.margins.left-this.margins.right,(b?Math.max(c.scrollHeight,c.offsetHeight):c.offsetHeight)-(parseInt(d(c).css("borderTopWidth"),10)||0)-(parseInt(d(c).css("paddingBottom"),10)||0)-this.helperProportions.height-
this.margins.top-this.margins.bottom];this.relative_container=a}}else if(a.containment.constructor==Array)this.containment=a.containment},_convertPositionTo:function(a,c){if(!c)c=this.position;var b=a=="absolute"?1:-1,f=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],this.offsetParent[0]))?this.offsetParent:this.scrollParent,e=/(html|body)/i.test(f[0].tagName);return{top:c.top+this.offset.relative.top*b+this.offset.parent.top*b-(d.browser.safari&&
d.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollTop():e?0:f.scrollTop())*b),left:c.left+this.offset.relative.left*b+this.offset.parent.left*b-(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:(this.cssPosition=="fixed"?-this.scrollParent.scrollLeft():e?0:f.scrollLeft())*b)}},_generatePosition:function(a){var c=this.options,b=this.cssPosition=="absolute"&&!(this.scrollParent[0]!=document&&d.ui.contains(this.scrollParent[0],
this.offsetParent[0]))?this.offsetParent:this.scrollParent,f=/(html|body)/i.test(b[0].tagName),e=a.pageX,h=a.pageY;if(this.originalPosition){var g;if(this.containment)this.relative_container?(g=this.relative_container.offset(),g=[this.containment[0]+g.left,this.containment[1]+g.top,this.containment[2]+g.left,this.containment[3]+g.top]):g=this.containment,a.pageX-this.offset.click.left<g[0]&&(e=g[0]+this.offset.click.left),a.pageY-this.offset.click.top<g[1]&&(h=g[1]+this.offset.click.top),a.pageX-
this.offset.click.left>g[2]&&(e=g[2]+this.offset.click.left),a.pageY-this.offset.click.top>g[3]&&(h=g[3]+this.offset.click.top);c.grid&&(h=c.grid[1]?this.originalPageY+Math.round((h-this.originalPageY)/c.grid[1])*c.grid[1]:this.originalPageY,h=g?!(h-this.offset.click.top<g[1]||h-this.offset.click.top>g[3])?h:!(h-this.offset.click.top<g[1])?h-c.grid[1]:h+c.grid[1]:h,e=c.grid[0]?this.originalPageX+Math.round((e-this.originalPageX)/c.grid[0])*c.grid[0]:this.originalPageX,e=g?!(e-this.offset.click.left<
g[0]||e-this.offset.click.left>g[2])?e:!(e-this.offset.click.left<g[0])?e-c.grid[0]:e+c.grid[0]:e)}return{top:h-this.offset.click.top-this.offset.relative.top-this.offset.parent.top+(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?-this.scrollParent.scrollTop():f?0:b.scrollTop()),left:e-this.offset.click.left-this.offset.relative.left-this.offset.parent.left+(d.browser.safari&&d.browser.version<526&&this.cssPosition=="fixed"?0:this.cssPosition=="fixed"?
-this.scrollParent.scrollLeft():f?0:b.scrollLeft())}},_clear:function(){this.helper.removeClass("ui-draggable-dragging");this.helper[0]!=this.element[0]&&!this.cancelHelperRemoval&&this.helper.remove();this.helper=null;this.cancelHelperRemoval=!1},_trigger:function(a,c,b){b=b||this._uiHash();d.ui.plugin.call(this,a,[c,b]);if(a=="drag")this.positionAbs=this._convertPositionTo("absolute");return d.Widget.prototype._trigger.call(this,a,c,b)},plugins:{},_uiHash:function(){return{helper:this.helper,position:this.position,
originalPosition:this.originalPosition,offset:this.positionAbs}}});d.extend(d.ui.draggable,{version:"@VERSION"});d.ui.plugin.add("draggable","connectToSortable",{start:function(a,c){var b=d(this).data("draggable"),f=b.options,e=d.extend({},c,{item:b.element});b.sortables=[];d(f.connectToSortable).each(function(){var c=d.data(this,"sortable");c&&!c.options.disabled&&(b.sortables.push({instance:c,shouldRevert:c.options.revert}),c.refreshPositions(),c._trigger("activate",a,e))})},stop:function(a,c){var b=
d(this).data("draggable"),f=d.extend({},c,{item:b.element});d.each(b.sortables,function(){if(this.instance.isOver){this.instance.isOver=0;b.cancelHelperRemoval=!0;this.instance.cancelHelperRemoval=!1;if(this.shouldRevert)this.instance.options.revert=!0;this.instance._mouseStop(a);this.instance.options.helper=this.instance.options._helper;b.options.helper=="original"&&this.instance.currentItem.css({top:"auto",left:"auto"})}else this.instance.cancelHelperRemoval=!1,this.instance._trigger("deactivate",
a,f)})},drag:function(a,c){var b=d(this).data("draggable"),f=this;d.each(b.sortables,function(){this.instance.positionAbs=b.positionAbs;this.instance.helperProportions=b.helperProportions;this.instance.offset.click=b.offset.click;if(this.instance._intersectsWith(this.instance.containerCache)){if(!this.instance.isOver)this.instance.isOver=1,this.instance.currentItem=d(f).clone().removeAttr("id").appendTo(this.instance.element).data("sortable-item",!0),this.instance.options._helper=this.instance.options.helper,
this.instance.options.helper=function(){return c.helper[0]},a.target=this.instance.currentItem[0],this.instance._mouseCapture(a,!0),this.instance._mouseStart(a,!0,!0),this.instance.offset.click.top=b.offset.click.top,this.instance.offset.click.left=b.offset.click.left,this.instance.offset.parent.left-=b.offset.parent.left-this.instance.offset.parent.left,this.instance.offset.parent.top-=b.offset.parent.top-this.instance.offset.parent.top,b._trigger("toSortable",a),b.dropped=this.instance.element,
b.currentItem=b.element,this.instance.fromOutside=b;this.instance.currentItem&&this.instance._mouseDrag(a)}else if(this.instance.isOver)this.instance.isOver=0,this.instance.cancelHelperRemoval=!0,this.instance.options.revert=!1,this.instance._trigger("out",a,this.instance._uiHash(this.instance)),this.instance._mouseStop(a,!0),this.instance.options.helper=this.instance.options._helper,this.instance.currentItem.remove(),this.instance.placeholder&&this.instance.placeholder.remove(),b._trigger("fromSortable",
a),b.dropped=!1})}});d.ui.plugin.add("draggable","cursor",{start:function(){var a=d("body"),c=d(this).data("draggable").options;if(a.css("cursor"))c._cursor=a.css("cursor");a.css("cursor",c.cursor)},stop:function(){var a=d(this).data("draggable").options;a._cursor&&d("body").css("cursor",a._cursor)}});d.ui.plugin.add("draggable","opacity",{start:function(a,c){var b=d(c.helper),f=d(this).data("draggable").options;if(b.css("opacity"))f._opacity=b.css("opacity");b.css("opacity",f.opacity)},stop:function(a,
c){var b=d(this).data("draggable").options;b._opacity&&d(c.helper).css("opacity",b._opacity)}});d.ui.plugin.add("draggable","scroll",{start:function(){var a=d(this).data("draggable");if(a.scrollParent[0]!=document&&a.scrollParent[0].tagName!="HTML")a.overflowOffset=a.scrollParent.offset()},drag:function(a){var c=d(this).data("draggable"),b=c.options,f=!1;if(c.scrollParent[0]!=document&&c.scrollParent[0].tagName!="HTML"){if(!b.axis||b.axis!="x")if(c.overflowOffset.top+c.scrollParent[0].offsetHeight-
a.pageY<b.scrollSensitivity)c.scrollParent[0].scrollTop=f=c.scrollParent[0].scrollTop+b.scrollSpeed;else if(a.pageY-c.overflowOffset.top<b.scrollSensitivity)c.scrollParent[0].scrollTop=f=c.scrollParent[0].scrollTop-b.scrollSpeed;if(!b.axis||b.axis!="y")if(c.overflowOffset.left+c.scrollParent[0].offsetWidth-a.pageX<b.scrollSensitivity)c.scrollParent[0].scrollLeft=f=c.scrollParent[0].scrollLeft+b.scrollSpeed;else if(a.pageX-c.overflowOffset.left<b.scrollSensitivity)c.scrollParent[0].scrollLeft=f=c.scrollParent[0].scrollLeft-
b.scrollSpeed}else{if(!b.axis||b.axis!="x")a.pageY-d(document).scrollTop()<b.scrollSensitivity?f=d(document).scrollTop(d(document).scrollTop()-b.scrollSpeed):d(window).height()-(a.pageY-d(document).scrollTop())<b.scrollSensitivity&&(f=d(document).scrollTop(d(document).scrollTop()+b.scrollSpeed));if(!b.axis||b.axis!="y")a.pageX-d(document).scrollLeft()<b.scrollSensitivity?f=d(document).scrollLeft(d(document).scrollLeft()-b.scrollSpeed):d(window).width()-(a.pageX-d(document).scrollLeft())<b.scrollSensitivity&&
(f=d(document).scrollLeft(d(document).scrollLeft()+b.scrollSpeed))}f!==!1&&d.ui.ddmanager&&!b.dropBehaviour&&d.ui.ddmanager.prepareOffsets(c,a)}});d.ui.plugin.add("draggable","snap",{start:function(){var a=d(this).data("draggable"),c=a.options;a.snapElements=[];d(c.snap.constructor!=String?c.snap.items||":data(draggable)":c.snap).each(function(){var b=d(this),c=b.offset();this!=a.element[0]&&a.snapElements.push({item:this,width:b.outerWidth(),height:b.outerHeight(),top:c.top,left:c.left})})},drag:function(a,
c){for(var b=d(this).data("draggable"),f=b.options,e=f.snapTolerance,h=c.offset.left,g=h+b.helperProportions.width,n=c.offset.top,o=n+b.helperProportions.height,i=b.snapElements.length-1;i>=0;i--){var j=b.snapElements[i].left,l=j+b.snapElements[i].width,k=b.snapElements[i].top,m=k+b.snapElements[i].height;if(j-e<h&&h<l+e&&k-e<n&&n<m+e||j-e<h&&h<l+e&&k-e<o&&o<m+e||j-e<g&&g<l+e&&k-e<n&&n<m+e||j-e<g&&g<l+e&&k-e<o&&o<m+e){if(f.snapMode!="inner"){var p=Math.abs(k-o)<=e,q=Math.abs(m-n)<=e,r=Math.abs(j-
g)<=e,s=Math.abs(l-h)<=e;if(p)c.position.top=b._convertPositionTo("relative",{top:k-b.helperProportions.height,left:0}).top-b.margins.top;if(q)c.position.top=b._convertPositionTo("relative",{top:m,left:0}).top-b.margins.top;if(r)c.position.left=b._convertPositionTo("relative",{top:0,left:j-b.helperProportions.width}).left-b.margins.left;if(s)c.position.left=b._convertPositionTo("relative",{top:0,left:l}).left-b.margins.left}var t=p||q||r||s;if(f.snapMode!="outer"){p=Math.abs(k-n)<=e;q=Math.abs(m-
o)<=e;r=Math.abs(j-h)<=e;s=Math.abs(l-g)<=e;if(p)c.position.top=b._convertPositionTo("relative",{top:k,left:0}).top-b.margins.top;if(q)c.position.top=b._convertPositionTo("relative",{top:m-b.helperProportions.height,left:0}).top-b.margins.top;if(r)c.position.left=b._convertPositionTo("relative",{top:0,left:j}).left-b.margins.left;if(s)c.position.left=b._convertPositionTo("relative",{top:0,left:l-b.helperProportions.width}).left-b.margins.left}!b.snapElements[i].snapping&&(p||q||r||s||t)&&b.options.snap.snap&&
b.options.snap.snap.call(b.element,a,d.extend(b._uiHash(),{snapItem:b.snapElements[i].item}));b.snapElements[i].snapping=p||q||r||s||t}else b.snapElements[i].snapping&&b.options.snap.release&&b.options.snap.release.call(b.element,a,d.extend(b._uiHash(),{snapItem:b.snapElements[i].item})),b.snapElements[i].snapping=!1}}});d.ui.plugin.add("draggable","stack",{start:function(){var a=d(this).data("draggable").options,a=d.makeArray(d(a.stack)).sort(function(a,c){return(parseInt(d(a).css("zIndex"),10)||
0)-(parseInt(d(c).css("zIndex"),10)||0)});if(a.length){var c=parseInt(a[0].style.zIndex)||0;d(a).each(function(a){this.style.zIndex=c+a});this[0].style.zIndex=c+a.length}}});d.ui.plugin.add("draggable","zIndex",{start:function(a,c){var b=d(c.helper),f=d(this).data("draggable").options;if(b.css("zIndex"))f._zIndex=b.css("zIndex");b.css("zIndex",f.zIndex)},stop:function(a,c){var b=d(this).data("draggable").options;b._zIndex&&d(c.helper).css("zIndex",b._zIndex)}})})(jQuery);
