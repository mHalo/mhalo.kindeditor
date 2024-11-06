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
		console.info(self);
		var preCodeNode = self.plugin.getSelectedPreCode(), preCode = '',preLang = 'js'	;
		if(!!preCodeNode){
			preCode = preCodeNode.html().match(/<code[^>]*>([\s\S]*?)<\/code>/)[1];;
			preLang = (preCodeNode.attr("class").match(/lang-(\w+)/ig) || [])[0];
			if(!!preLang){
				preLang = preLang.replace("lang-", "");
			}
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
				'<option value="sql">SQL</option>',
				'<option value="">Other</option>',
				'</select>',
				'</div>',
				'<textarea class="ke-textarea" style="width:100%;height:330px;">',
				preCode,
				'</textarea>',
				'</div>'].join(''),
			dialog = self.createDialog({
				name : name,
				width : 650,
				height : 500,
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
							cls = type === '' ? '' :  ' ke-code lang-' + type;
						if (K.trim(code) === '') {
							alert(lang.pleaseInput);
							textarea[0].focus();
							return;
						}
						if(!!preCodeNode){
							preCodeNode.html(K.escape(code)).attr("class", cls);
							self.hideDialog().focus();
							return
						}else{
							// html = '<pre class="' + cls + '">\n' + K.escape(code) + '\n</pre> ';
							html = '<pre class="' + cls + '"><code class="language-' + type + '">' + K.escape(code) + '</code></pre>';
						}
						self.insertHtml(html).hideDialog().focus();
					}
				}
			}),
			textarea = K('textarea', dialog.div),
			select = K('select', dialog.div);
		K(select).children().each(function(i,o){
			var node = K(o);
			if(node.val() === preLang){
				node.attr("selected", true);
				setTimeout(function(){
					K(select).val(preLang)
					select[0].value = preLang;
				}, 180);
			}else{
				node.removeAttr("selected");
			}
		})
		textarea[0].focus();
	});
});
