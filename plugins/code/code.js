/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2011 kindsoft.net
*
* @author Roddy <luolonghao@gmail.com>
* @site http://www.kindsoft.net/
* @licence http://www.kindsoft.net/license.php
*******************************************************************************/

// google code prettify: http://google-code-prettify.googlecode.com/
// http://google-code-prettify.googlecode.com/

KindEditor.plugin('code', function(K) {
	var self = this, name = 'code';
	self.clickToolbar(name, function() {
		self.cmd.selection();
		var preCodeNode = self.plugin.getSelectedPreCode(), preCode = '';
		if(!!preCodeNode){
			preCode = preCodeNode.html();
		}
		var lang = self.lang(name + '.'),
			html = ['<div style="padding:10px 20px;">',
				'<div class="ke-dialog-row">',
				'<select class="ke-code-type">',
				'<option value="js">JavaScript</option>',
				'<option value="html">HTML</option>',
				'<option value="css">CSS</option>',
				'<option value="php">PHP</option>',
				'<option value="pl">Perl</option>',
				'<option value="py">Python</option>',
				'<option value="rb">Ruby</option>',
				'<option value="java">Java</option>',
				'<option value="vb">ASP/VB</option>',
				'<option value="cpp">C/C++</option>',
				'<option value="cs">C#</option>',
				'<option value="xml">XML</option>',
				'<option value="bsh">Shell</option>',
				'<option value="bsh">SQL</option>',
				'<option value="">Other</option>',
				'</select>',
				'</div>',
				'<textarea class="ke-textarea" style="width:518px;height:260px;">',
				preCode,
				'</textarea>',
				'</div>'].join(''),
			dialog = self.createDialog({
				name : name,
				width : 560,
				title : self.lang(name),
				body : html,
				yesBtn : {
					name : self.lang('yes'),
					click : function(e) {
						var type = K('.ke-code-type', dialog.div).val(),
							code = 
							textarea.val()    
								.replace(/^\s+/g, '')
								.replace(/\s+$/g, '\n')
								.replace(/(\s*<!--)/g, '\n$1')
								.replace(/>(\s*)(?=<!--\s*\/)/g, '> '),
							cls = type === '' ? '' :  ' ke-code lang-' + type,
							html = '<pre class="' + cls + '">\n' + K.escape(code) + '\n</pre> ';
						if (K.trim(code) === '') {
							alert(lang.pleaseInput);
							textarea[0].focus();
							return;
						}
						self.insertHtml(html).hideDialog().focus();
					}
				}
			}),
			textarea = K('textarea', dialog.div);
		textarea[0].focus();
	});
});
