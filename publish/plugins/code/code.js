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
	var self = this, name = 'code', lineBreak = `<line-break>\n</line-break>`, codeRegex = /<code[^>]*>([\s\S]*?)<\/code>/;
	function extractFormattedCodeFromHTML(preCodeNode) {
		// 定义一个函数来递归提取格式化的代码
		function extractContent(element) {
		  var content = '';
		  Array.from(element.childNodes).forEach(function(child) {
			if(child?.parentNode?.classList?.contains('line-numbers-rows')){
				console.info('skip');
			}else{
				if (child.nodeType === Node.TEXT_NODE) {
					content += child.nodeValue;
				  } else if (child.tagName) {
					switch (child.tagName.toLowerCase()) {
					  case 'br':
						content += '\n';
						break;
					  case 'line-break':
						content += '\n';
						break;
					  case 'span':
						// 递归提取 span 中的内容
						content += extractContent(child);
						break;
					  // 添加其他需要处理的标签
					}
				}
			}
		  });
		  return content;
		}
		
		// 从 tempDiv 中提取格式化的代码
		var formattedCode = extractContent(preCodeNode.children().get(0));
		// 清理并返回格式化的代码
		return formattedCode//;.replace(/\n{3,}/g, '\n\n'); // 替换多余的换行符
	}
	function capitalizeAndNormalizeSpaces(str) {
		// 首先替换掉连续的空格为一个空格
		var normalizedStr = str.replace(/\s+/g, ' ');
		// 然后将每个单词的首字母大写
		return normalizedStr.replace(/\b\w/g, function(char) {
		  return char.toUpperCase();
		});
	  }

	self.clickToolbar(name, function() {
		var prism = self.edit.win.Prism;
		console.info('prism', prism)

		self.cmd.selection();
		var preCodeNode = self.plugin.getSelectedPreCode(), preCode = '',preLang = 'javascript'	;
		if(!!preCodeNode){
			if(prism){
				preCode = extractFormattedCodeFromHTML(preCodeNode)
			}else{
				preCode = preCodeNode.html();
				preCode = preCode.match(codeRegex)[1];
			}

			preLang = (preCodeNode.attr("class").match(/lang-(\w+)/ig) || [])[0];
			if(!!preLang){
				preLang = preLang.replace("lang-", "");
			}
		}

		var languageSupport = [];
		if(prism){
			var plang = prism.languages, langs = {  };
			for (const key in plang) {
				if (plang.hasOwnProperty(key) && typeof plang[key] !== 'function' && key !== 'meta') {
					var pid = plang[key].__id
					if(!!!langs[pid]){
						langs[pid] = key;
						languageSupport.push({ key: key, value: capitalizeAndNormalizeSpaces(key) })
					}
				}
			}
		}else{
			languageSupport = [
				{ key: "javascript", value: "JavaScript" },
				{ key: "html", value: "HTML" },
				{ key: "css", value: "CSS" },
				{ key: "php", value: "PHP" },
				{ key: "pl", value: "Perl" },
				{ key: "py", value: "Python" },
				{ key: "rb", value: "Ruby" },
				{ key: "java", value: "Java" },
				{ key: "vb", value: "ASP" },
				{ key: "cpp", value: "C" },
				{ key: "cs", value: "C" },
				{ key: "xml", value: "XML" },
				{ key: "bsh", value: "Shell" },
				{ key: "sql", value: "SQL" },
				{ key: "none", value: "Other" }
			]
		}
		var languageSupportOptions = languageSupport.map(function(o){
			return `<option value="${o.key}">${o.value}</option>`
		}).join('');

		var lang = self.lang(name + '.'),
			html = ['<div style="padding:10px 20px;">',
				'<div class="ke-dialog-row">',
				'<select class="ke-code-type">',
				languageSupportOptions,
				'</select>',
				'</div>',
				'<textarea class="ke-textarea" style="width:100%;height:330px;">\r\n',
				preCode.replace(/\n/g, '\r\n'),
				'</textarea>\r\n',
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
							cls = type === '' ? '' :  ` ke-code line-numbers language-${type} lang-${type}`;
						if (K.trim(code) === '') {
							alert(lang.pleaseInput);
							textarea[0].focus();
							return;
						}
						if(!!preCodeNode){
							if(prism){
								var preElement = document.createElement("pre");
								preElement.className= cls + ' line-numbers';
								var codeElement = document.createElement("code");
								codeElement.className= 'line-numbers';
								
								code = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
								codeElement.innerHTML = code;
								preElement.appendChild(codeElement);

								prism.highlightElement(codeElement, false);
								code = preElement.innerHTML;
								// code = prism.highlight(code, prism.languages[type], type);
								
								code = code.replace(/\n/g, lineBreak);
								preCodeNode.html(code).attr("class", cls);
								preCodeNode.next('\n')
								self.hideDialog().focus();
								return

							}else{
								preCodeNode.html(`<code class="language-${type}">${K.escape(code)}</code>`).attr("class", cls);
								preCodeNode.next('\n')
								self.hideDialog().focus();
								return
							}
						}else{
							if(prism){
								
								code = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
								var preElement = document.createElement("pre");
								preElement.className= cls + ' line-numbers';
								var codeElement = document.createElement("code");
								codeElement.className= 'line-numbers';
								codeElement.innerHTML = code;
								preElement.appendChild(codeElement);

								prism.highlightElement(codeElement, false);
								code = preElement.innerHTML;

								code = code.replace(/\n/g, lineBreak);
								html = '<pre class="' + cls + ' ">' + code + '</pre>\n<br />';
							}else{
								html = '<pre class="' + cls + ' "><code class="language-' + type + ' ">' + K.escape(code) + '</code></pre>\n<br />';
							}
						}
						var anchorCur = self?.cmd.sel?.extentNode;
						if(anchorCur && K(anchorCur).name == 'p'){
							var anchorChildren = K(anchorCur).children();
							if(anchorChildren.length == 1 && anchorChildren.name == 'br'){
								K(anchorCur).replaceWith(html);
							}
						}else{
							var parentNode = K(anchorCur).parent() || self;
							parentNode.after(html);
						}
						self.hideDialog().focus();

						var last = K(self.edit.doc.body).last()?.children();
						if(last && (last.length != 1 || last.name !== 'br')){
							K(self.edit.doc.body).append("<p><br /></p>")
						}
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
