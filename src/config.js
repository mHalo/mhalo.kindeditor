
function _getBasePath() {
	var els = document.getElementsByTagName('script'), src;
	for (var i = 0, len = els.length; i < len; i++) {
		src = els[i].src || '';
		if (/kindeditor[\w\-\.]*\.js/.test(src)) {
			return src.substring(0, src.lastIndexOf('/') + 1);
		}
	}
	return '';
}

K.basePath = _getBasePath();

K.Tools = {
	All: ['source', '|', 'undo', 'redo','removeformat','clearhtml', '|',  'template', 'code', 'cut', 'copy',
	'plainpaste', 'wordpaste', '|', 'preview','selectall', 'fullscreen', 'print', '|', 'quickformat', '/', 
	'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', 'strikethrough', '|', 
	'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', '|', 
	'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent','lineheight', '/',
	'quote', 'subscript','superscript','|', 'image', 'multiimage',	'media', 'insertfile','baidumap','link', 'unlink', '|',
	'table', 'anchor', 'hr',  'pagebreak'],

	Normal: ['source', '|', 
	'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', 'strikethrough', '|', 
	'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', '|', 
	'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent','lineheight', '/',
	'image', 'multiimage',	'media', 'insertfile','baidumap','link', 'unlink', '|',
	'table', 'anchor', 'hr',  'pagebreak','|', 'quote', 'subscript','superscript', '|', 'preview', 'fullscreen', 'quickformat',],

	Small: ['source', '|','formatblock', 'fontname', 'fontsize', '|',
	'bold', 'italic', 'underline', 'strikethrough', '|',
	'justifyleft', 'justifycenter', 'justifyright',	'justifyfull', '|',
	'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent','lineheight', '/',
	'quote', 'image', 'multiimage', 'media', 'insertfile', '|','table', 'hr','pagebreak', '|', 'link', 'unlink', '|','preview', 'fullscreen'],

	Mini: [
		'formatblock',  'bold', 'italic', 'underline', 'strikethrough', '|',
		'justifyleft', 'justifycenter', 'justifyright',	'justifyfull', '|',
		'insertorderedlist', 'insertunorderedlist','|',
		'image', 'insertfile','table', 'link'
	]
};
K.Templates = [
	{ name: '图片和文字', content: '<h3><img align="left" height="100" style="margin-right: 10px" width="100" />在此处输入标题</h3><p>在此处输入内容</p>'},
	{ name: '表格', content: '<h3>标题</h3><table style="width:100%;" cellpadding="2" cellspacing="0" border="1"><tbody><tr><td><h3>标题1</h3></td><td><h3>标题1</h3></td></tr><tr><td>内容1</td><td>内容2</td></tr><tr><td>内容3</td><td>内容4</td></tr></tbody></table><p>表格说明</p>' },
	{ name: '项目编号', content: '<p>在此处输入内容</p><ol><li>描述1</li><li>描述2</li><li>描述3</li></ol><p>在此处输入内容</p><ul><li>描述1</li><li>描述2</li><li>描述3</li></ul>' },
];

K.options = {
	designMode : true,
	fullscreenMode : false,
	filterMode : true,
	wellFormatMode : true,
	shadowMode : true,
	loadStyleMode : true,
	basePath : K.basePath,
	themesPath : K.basePath + 'themes/',
	langPath : K.basePath + 'lang/',
	pluginsPath : K.basePath + 'plugins/',
	themeType : 'default', // default, simple
	langType : 'zh-CN',
	urlType : '', // "", relative, absolute, domain
	newlineTag : 'p', // p, br
	resizeType : 2, // 0, 1, 2
	syncType : 'form', // "", form
	pasteType : 2, // 0:none, 1:text, 2:HTML
	dialogAlignType : 'page', // page, editor
	useContextmenu : true,
	fullscreenShortcut : false,
	bodyClass : 'ke-content',
	indentChar : '\t', // \t, "  "
	cssPath : '', //String or Array
	cssData : '',
	minWidth : 650,
	minHeight : 100,
	minChangeSize : 50,
	zIndex : 811213,
	items :  K.Tools.Normal,
	noDisableItems : ['source', 'fullscreen'],
	colorTable : [	
		['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#4e5f70', '#f1c40f'],
		['#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50', '#f39c12'],
		['#E53333', '#E56600', '#FF9900', '#64451D', '#DFC5A4', '#FFE500'],
		['#009900', '#006600', '#99BB00', '#B8D100', '#60D978', '#00D5FF'],
		['#337FE5', '#003399', '#4C33E5', '#9933E5', '#CC33E5', '#EE33EE'],
		['#FFFFFF', '#CCCCCC', '#999999', '#666666', '#333333', '#000000']
	],
	fontSizeTable : ['9px', '10px', '12px', '14px', '16px', '18px', '24px', '32px'],
	htmlTags : {
		font : ['id', 'class', 'color', 'size', 'face', '.background-color'],
		span : [
			'id', 'class', '.color', '.background-color', '.font-size', '.font-family', '.background',
			'.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.line-height'
		],
		div : [
			'id', 'class', 'align', '.border', '.margin', '.padding', '.text-align', '.color',
			'.background-color', '.font-size', '.font-family', '.font-weight', '.background',
			'.font-style', '.text-decoration', '.vertical-align', '.margin-left'
		],
		table: [
			'id', 'class', 'border', 'cellspacing', 'cellpadding', 'width', 'height', 'align', 'bordercolor',
			'.padding', '.margin', '.border', 'bgcolor', '.text-align', '.color', '.background-color',
			'.font-size', '.font-family', '.font-weight', '.font-style', '.text-decoration', '.background',
			'.width', '.height', '.border-collapse'
		],
		'td,th': [
			'id', 'class', 'align', 'valign', 'width', 'height', 'colspan', 'rowspan', 'bgcolor',
			'.text-align', '.color', '.background-color', '.font-size', '.font-family', '.font-weight',
			'.font-style', '.text-decoration', '.vertical-align', '.background', '.border'
		],
		a : ['id', 'class', 'href', 'target', 'name'],
		media : ['id', 'class'],
		audio : ['id', 'class', 'src', 'width', 'height', 'type', 'loop', 'autostart', 'autoplay', '.width', '.height', 'controls', 'muted', 'preload'],
		video : ['id', 'class', 'src', 'width', 'height', 'type', 'loop', 'autostart', 'autoplay', '.width', '.height', 'controls', 'muted', 'poster', 'preload'],
		img : ['id', 'class', 'src', 'width', 'height', 'border', 'alt', 'title', 'align', '.width', '.height', '.border'],
		'p,ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6' : [
			'id', 'class', 'align', '.text-align', '.color', '.background-color', '.font-size', '.font-family', '.background',
			'.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.text-indent', '.margin-left'
		],
		pre : ['id', 'class'],
		hr : ['id', 'class', '.page-break-after'],
		'br,tbody,tr,strong,b,sub,sup,em,i,u,strike,s,del' : ['id', 'class'],
		iframe : ['id', 'class', 'src', 'frameborder', 'width', 'height', '.width', '.height']
	},
	layout : '<div class="container"><div class="toolbar"></div><div class="edit"></div><div class="statusbar"></div></div>'
};
