
function _iframeDoc(iframe) {
	iframe = _get(iframe);
	return iframe.contentDocument || iframe.contentWindow.document;
}

var html, _direction = '';
if ((html = document.getElementsByTagName('html'))) {
	_direction = html[0].dir;
}

function _getInitHtml(themesPath, bodyClass, cssPath, cssData, prismPath) {
	var arr = [
		(_direction === '' ? '<html>' : '<html dir="' + _direction + '">'),
		'<head><meta charset="utf-8" /><title></title>',
		!!prismPath ? `<link href="${prismPath}/prism.css" rel="stylesheet" />` : '',
		'<style>',
		'html,body {margin:0;padding:0;}',
		'body, td {font:12px/1.5 "PingFang","Microsoft Yahei","苹方","微软雅黑", "sans serif",tahoma,verdana,helvetica;}',
		'body, p, div {word-wrap: break-word;line-height:28px;}',
		'table {border-collapse:collapse;}',
		'noscript {display:none;}',
		'table.ke-zeroborder td {border:1px dotted #AAA;}',
		'.ke-content {padding: 15px;}',
		'img[data-ke-class="ke-image"] { max-width: 100%;border: 2px solid transparent; }',
		'img[data-ke-class="ke-image"]:hover { border-color: #4696ec; }',
		'audio,video{ border:3px solid transparent; }',
		'audio:hover, video:hover{ border:3px solid #2196f3; }',
		'pre{ font-size: 14px!important;line-height: 20px;width: 100%;background-color: #f4f2f0;padding: 6px 18px;box-sizing: border-box; border: 3px solid transparent;    word-break: break-all;white-space: break-spaces;-webkit-user-modify: read-only;line-height: 1.2em!important;}',
		'pre:hover,pre:active{border: 3px solid #4696ec;}',
		// 'img.ke-flash {',
		// '	border:1px solid #AAA;',
		// '	background-image:url(' + themesPath + 'common/flash.gif);',
		// '	background-position:center center;',
		// '	background-repeat:no-repeat;',
		// '	width:100px;',
		// '	height:100px;',
		// '}',
		// 'img.ke-rm {',
		// '	border:1px solid #AAA;',
		// '	background-image:url(' + themesPath + 'common/rm.gif);',
		// '	background-position:center center;',
		// '	background-repeat:no-repeat;',
		// '	width:100px;',
		// '	height:100px;',
		// '}',
		// 'img.ke-media {',
		// '	border:1px solid #AAA;',
		// '	background-image:url(' + themesPath + 'common/media.gif);',
		// '	background-position:center center;',
		// '	background-repeat:no-repeat;',
		// '	width:100px;',
		// '	height:100px;',
		// '}',
		// 'img.ke-anchor {',
		// '	border:1px dashed #666;',
		// '	width:16px;',
		// '	height:16px;',
		// '}',
		'.ke-script, .ke-noscript, .ke-display-none {',
		'	display:none;',
		'	font-size:0;',
		'	width:0;',
		'	height:0;',
		'}',
		'.ke-pagebreak {',
		'	border:1px dotted #AAA;',
		'	font-size:0;',
		'	height:2px;',
		'}',
		'</style>'
	];
	if (!_isArray(cssPath)) {
		cssPath = [cssPath];
	}
	_each(cssPath, function(i, path) {
		if (path) {
			arr.push('<link href="' + path + '" rel="stylesheet" />');
		}
	});
	if (cssData) {
		arr.push('<style>' + cssData + '</style>');
	}
	// arr.push(!!prismPath ? `<script src="${prismPath}/prism.js"></script>` : '')
	arr.push('</head><body ' + (bodyClass ? 'class="' + bodyClass + '"' : '') + ' author="MHalo"></body>');
	arr.push('</html>');
	return arr.join('\n');
}

function _elementVal(knode, val) {
	if (knode.hasVal()) {
		if (val === undefined) {
			var html = knode.val();
			// 去除内容为空的p标签
			// https://github.com/kindsoft/kindeditor/pull/52
			html = html.replace(/(<(?:p|p\s[^>]*)>) *(<\/p>)/ig, '');
			return html;
		}
		return knode.val(val);
	}
	return knode.html(val);
}

// create KEdit class
function KEdit(options) {
	this.init(options);
}
_extend(KEdit, KWidget, {
	init : function(options) {
		var self = this;
		KEdit.parent.init.call(self, options);
		self.srcElement = K(options.srcElement);
		self.div.addClass('ke-edit');
		self.designMode = _undef(options.designMode, true);
		self.beforeGetHtml = options.beforeGetHtml;
		self.beforeSetHtml = options.beforeSetHtml;
		self.afterSetHtml = options.afterSetHtml;

		var themesPath = _undef(options.themesPath, ''),
			prismPath = _undef(options.editorOptions.prismPath, ''),
			bodyClass = options.bodyClass,
			cssPath = options.cssPath,
			cssData = options.cssData,
			isDocumentDomain = location.protocol != 'res:' && location.host.replace(/:\d+/, '') !== document.domain,
			srcScript = ('document.open();' +
				(isDocumentDomain ? 'document.domain="' + document.domain + '";' : '') +
				'document.close();'),
			iframeSrc = _IE ? ' src="javascript:void(function(){' + encodeURIComponent(srcScript) + '}())"' : '';
		self.iframe = K('<iframe class="ke-edit-iframe" hidefocus="true" frameborder="0"' + iframeSrc + '></iframe>').css('width', '100%');
		self.textarea = K('<textarea class="ke-edit-textarea" hidefocus="true"></textarea>').css('width', '100%');
		self.tabIndex = isNaN(parseInt(options.tabIndex, 10)) ? self.srcElement.attr('tabindex') : parseInt(options.tabIndex, 10);
		self.iframe.attr('tabindex', self.tabIndex);
		self.textarea.attr('tabindex', self.tabIndex);


		if (self.width) {
			self.setWidth(self.width);
		}
		if (self.height) {
			self.setHeight(self.height);
		}
		if (self.designMode) {
			self.textarea.hide();
		} else {
			self.iframe.hide();
		}
		function ready() {
			var doc = _iframeDoc(self.iframe);
			doc.open();
			if (isDocumentDomain) {
				doc.domain = document.domain;
			}
			doc.write(_getInitHtml(themesPath, bodyClass, cssPath, cssData, prismPath));
			doc.close();
			self.win = self.iframe[0].contentWindow;
			self.doc = doc;
			var cmd = _cmd(doc, options.editorOptions);
			// add events
			self.afterChange(function(e) {
				cmd.selection();
				var last = K(doc.body).last()?.children();
				if(last && (last.length != 1 || last.name !== 'br')){
					K(doc.body).append("<p><br /></p>")
				}
			});
			// [WEBKIT] select an image after click the image
			if (_WEBKIT) {
				K(doc).click(function(e) {
					if (K(e.target).name === 'img' || K(e.target).name === 'audio' || K(e.target).name === 'video' || K(e.target).name === 'pre') {
						cmd.selection(true);
						cmd.range.selectNode(e.target);
						cmd.select();
					}
				});
			}
			if (_IE) {
				// Fix bug: https://github.com/kindsoft/kindeditor/issues/53
				self._mousedownHandler = function() {
					var newRange = cmd.range.cloneRange();
					newRange.shrink();
					if (newRange.isControl()) {
						self.blur();
					}
				};
				K(document).mousedown(self._mousedownHandler);
				// [IE] bug: clear iframe when press backspase key
				K(doc).keydown(function(e) {
					if (e.which == 8) {
						console.info('ieieieie')
						cmd.selection();
						var rng = cmd.range;
						if (rng.isControl()) {
							rng.collapse(true);
							K(rng.startContainer.childNodes[rng.startOffset]).remove();
							e.preventDefault();
						}
					}
				});
			}
			self.cmd = cmd;
			self.html(_elementVal(self.srcElement));
			if (_IE) {
				doc.body.disabled = true;
				doc.body.contentEditable = true;
				doc.body.removeAttribute('disabled');
			} else {
				doc.designMode = 'on';
			}
			if (options.afterCreate) {
				let head = self?.doc?.head;
				if(!!prismPath && !!head){
					//<script src="../publish/dist/kindeditor-all.js"></script>
					// K(head).append(`<script src="${prismPath}/prism.js"></script>`);
					var script = self.doc.createElement('script');
					script.src = `${prismPath}/prism.js`;
					script.setAttribute('data-manual', 'true');
					head.appendChild(script);
				}
				options.afterCreate.call(self);
			}
		}
		if (isDocumentDomain) {
			self.iframe.bind('load', function(e) {
				self.iframe.unbind('load');
				if (_IE) {
					ready();
				} else {
					setTimeout(ready, 0);
				}
			});
		}
		self.div.append(self.iframe);
		self.div.append(self.textarea);
		self.srcElement.hide();
		!isDocumentDomain && ready();
	},
	setWidth : function(val) {
		var self = this;
		val = _addUnit(val);
		self.width = val;
		self.div.css('width', val);
		return self;
	},
	setHeight : function(val) {
		var self = this;
		val = _addUnit(val);
		self.height = val;
		self.div.css('height', val);
		self.iframe.css('height', val);
		// 校正IE6和IE7的textarea高度
		if ((_IE && _V < 8) || _QUIRKS) {
			val = _addUnit(_removeUnit(val) - 2);
		}
		self.textarea.css('height', val);
		return self;
	},
	remove : function() {
		var self = this, doc = self.doc;
		// remove events
		K(doc.body).unbind();
		K(doc).unbind();
		K(self.win).unbind();
		if (self._mousedownHandler) {
			K(document).unbind('mousedown', self._mousedownHandler);
		}
		// remove elements
		_elementVal(self.srcElement, self.html());
		self.srcElement.show();
		// doc.write('');
		self.iframe.unbind();
		self.textarea.unbind();
		KEdit.parent.remove.call(self);
	},
	html : function(val, isFull) {
		var self = this, doc = self.doc;
		// design mode
		if (self.designMode) {
			var body = doc.body;
			// get
			if (val === undefined) {
				if (isFull) {
					val = '<!doctype html><html>' + body.parentNode.innerHTML + '</html>';
				} else {
					val = body.innerHTML;
				}
				if (self.beforeGetHtml) {
					val = self.beforeGetHtml(val);
				}
				// bugfix: Firefox自动生成一个br标签
				if (_GECKO && val == '<br />') {
					val = '';
				}
				return val;
			}
			// set
			if (self.beforeSetHtml) {
				val = self.beforeSetHtml(val);
			}
			// IE9 Bugfix: https://github.com/kindsoft/kindeditor/issues/62
			if (_IE && _V >= 9) {
				val = val.replace(/(<.*?checked=")checked(".*>)/ig, '$1$2');
			}
			K(body).html(val);
			if (self.afterSetHtml) {
				self.afterSetHtml();
			}
			return self;
		}
		// source mode
		if (val === undefined) {
			return self.textarea.val();
		}
		self.textarea.val(val);
		return self;
	},
	design : function(bool) {
		var self = this, val;
		if (bool === undefined ? !self.designMode : bool) {
			if (!self.designMode) {
				val = self.html();

				self.designMode = true;
				self.textarea.hide();

				self.html(val);

				// cache
				var iframe = self.iframe;
				var height = _removeUnit(self.height);

				iframe.height(height - 2);
				iframe.show();

				// safari iframe scrollbar hack
				setTimeout(function() {
					iframe.height(height);
				}, 0);
			}
		} else {
			if (self.designMode) {
				val = self.html();
				self.designMode = false;
				self.html(val);
				self.iframe.hide();
				self.textarea.show();
			}
		}
		return self.focus();
	},
	focus : function() {
		var self = this;
		self.designMode ? self.win.focus() : self.textarea[0].focus();
		return self;
	},
	blur : function() {
		var self = this;
		if (_IE) {
			var input = K('<input type="text" style="float:left;width:0;height:0;padding:0;margin:0;border:0;" value="" />', self.div);
			self.div.append(input);
			input[0].focus();
			input.remove();
		} else {
			self.designMode ? self.win.blur() : self.textarea[0].blur();
		}
		return self;
	},
	afterChange : function(fn) {
		var self = this, doc = self.doc, body = doc.body;
		if(!fn) return;
		K(doc).keyup(function(e) {
			if (!e.ctrlKey && !e.altKey && _CHANGE_KEY_MAP[e.which]) {
				fn(e);
			}
		});
		K(doc).mouseup(fn).contextmenu(fn);
		K(self.win).blur(fn);
		function timeoutHandler(e) {
			setTimeout(function() {
				fn(e);
			}, 1);
		}
		K(body).bind('paste', timeoutHandler);
		K(body).bind('cut', timeoutHandler);
		return self;
	}
});

function _edit(options) {
	return new KEdit(options);
}

K.EditClass = KEdit;
K.edit = _edit;
K.iframeDoc = _iframeDoc;
