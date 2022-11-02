/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2011 kindsoft.net
*
* @author Roddy <luolonghao@gmail.com>
* @site http://www.kindsoft.net/
* @licence http://www.kindsoft.net/license.php
*******************************************************************************/

// Google Maps: http://code.google.com/apis/maps/index.html

KindEditor.plugin('baidumap', function(K) {
	var self = this, name = 'baidumap', lang = self.lang(name + '.'),
		baiduMapAk = K.undef(self.baiduMapAk, '9yfaQtWDimlbXuo4TMLmIk7yDjl36eCy'),
		mapWidth = K.undef(self.mapWidth, 558),
		mapHeight = K.undef(self.mapHeight, 360);

	self.clickToolbar(name, function() {
		var html = ['<div style="padding:10px 20px;">',
			'<div class="ke-dialog-row">',
			lang.address + ' <input id="kindeditor_plugin_map_address" name="address" class="ke-input-text" value="" style="width:450px;" /> ',
			'<span class="ke-button-common ke-button-outer">',
			'<input type="button" name="searchBtn" class="ke-button-common ke-button" value="' + lang.search + '" />',
			'</span>',
			'</div>',
			'<div class="ke-map" style="width:' + mapWidth + 'px;height:' + mapHeight + 'px;"></div>',
			'</div>'].join('');
		var dialog = self.createDialog({
			name : name,
			width : mapWidth + 42,
			title : self.lang(name),
			body : html,
			yesBtn : {
				name : self.lang('yes'),
				click : function(e) {
					var map = win.map;
					var centerObj = map.getCenter();
					var center = centerObj.lng + ',' + centerObj.lat;
					var zoom = map.getZoom();
					var url = [
						'http://api.map.baidu.com/staticimage/v2?ak=' + baiduMapAk,
						'&center=' + encodeURIComponent(center),
						'&zoom=' + encodeURIComponent(zoom),
						'&width=' + mapWidth * 2,
						'&height=' + mapHeight * 2,
						'&markers=' + encodeURIComponent(center),
						'&markerStyles=' + encodeURIComponent('l,A')].join('');
					if (false) {
						var src = 'https://map.baidu.com/@'+ (centerObj.lng * 100000).toFixed(3) + ',' + (centerObj.lat * 100000).toFixed(3) +','+ zoom +'z'
						self.insertHtml('<iframe src="'+ src +'" frameborder="0" style="width:' + (mapWidth + 2) + 'px;height:' + (mapHeight + 2) + 'px;"></iframe>');
					} else {
						self.exec('insertimage', url, 'title', mapWidth + '' , mapHeight + '', 0);
					}
					self.hideDialog().focus();
				}
			},
			beforeRemove : function() {
				searchBtn.remove();
				if (doc) {
					doc.write('');
				}
				iframe.remove();
			}
		});
		var div = dialog.div,
			addressBox = K('[name="address"]', div),
			searchBtn = K('[name="searchBtn"]', div),
			win, doc;
		var iframeHtml = ['<!doctype html><html><head>',
			'<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />',
			'<style>',
			'	html { height: 100% }',
			'	body { height: 100%; margin: 0; padding: 0; background-color: #FFF }',
			'	#map_canvas { height: 100% }',
			'</style>',
			'<script charset="utf-8" src="https://api.map.baidu.com/api?v=1.0&type=webgl&ak='+ baiduMapAk +'"></script>',
			'<script>',
			'var map, geocoder;',
			'function initialize() {',
			'	map = new BMapGL.Map("map_canvas");',
			'	var point = new BMapGL.Point(121.473704, 31.230393);',
			'	map.centerAndZoom(point, 11);',
			'	map.addControl(new BMapGL.NavigationControl());',
			'	map.enableScrollWheelZoom();',

			'	var gc = new BMapGL.Geocoder();',
			'	gc.getLocation(point, function(rs){',
			'		var addComp = rs.addressComponents;',
			'		var address = [addComp.city].join("");',
			'		parent.document.getElementById("kindeditor_plugin_map_address").value = address;',
			'	});',
			'}',
			'function search(address) {',
			'	if (!map) return;',
			'	var local = new BMapGL.LocalSearch(map, {',
			'		renderOptions: {',
			'			map: map,',
			'			autoViewport: true,',
			'			selectFirstResult: false',
			'		}',
			'	});',
			'	local.search(address);',
			'}',
			'</script>',
			'</head>',
			'<body onload="initialize();">',
			'<div id="map_canvas" style="width:100%; height:100%"></div>',
			'</body></html>'].join('\n');
		// TODO：用doc.write(iframeHtml)方式加载时，在IE6上第一次加载报错，暂时使用src方式
		var iframe = K('<iframe class="ke-textarea" frameborder="0" style="width:558px;height:360px;"></iframe>');
		function ready() {
			win = iframe[0].contentWindow;
			doc = K.iframeDoc(iframe);
			doc.open();
			doc.write(iframeHtml);
			doc.close();
		}
		iframe.bind('load', function() {
			iframe.unbind('load');
			if (K.IE) {
				ready();
			} else {
				setTimeout(ready, 0);
			}
		});
		K('.ke-map', div).replaceWith(iframe);
		// search map
		searchBtn.click(function() {
			win.search(addressBox.val());
		});
	});
});
