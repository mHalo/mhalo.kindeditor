/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2011 kindsoft.net
*
* @author Roddy <luolonghao@gmail.com>
* @site http://www.kindsoft.net/
* @licence http://www.kindsoft.net/license.php
*******************************************************************************/

KindEditor.plugin('template', function(K) {
	var self = this, name = 'template', lang = self.lang(name + '.'),
		htmlPath = self.pluginsPath + name + '/html/';

	var templates = K.undef(self.templates, K.Templates);

	self.clickToolbar(name, function() {
		var lang = self.lang(name + '.'),
			arr = ['<div style="padding:10px 20px;">',
				'<div class="ke-header">',
				// left start
				'<div class="ke-left">',
				lang. selectTemplate + ' <select>'];
			K.each(templates, function(i, o) {
				arr.push("<option value='" + o.content + "'>" + o.name + "</option>");
			});
			html = [arr.join(''),
				'</select></div>',
				// right start
				'<div class="ke-right">',
				'<input type="checkbox" id="keReplaceFlag" name="replaceFlag" value="1" /> <label for="keReplaceFlag">' + lang.replaceContent + '</label>',
				'</div>',
				'<div class="ke-clearfix"></div>',
				'</div>',
				'<div class="ke-temp-preview" style="width:518px;height:260px;background-color:#FFF;padding: 12px;overflow:auto;border-color: #848484 #E0E0E0 #E0E0E0 #848484;border-style: solid;border-width: 1px;"></div>',
				'</div>'].join('');
		var dialog = self.createDialog({
			name : name,
			width : 560,
			title : self.lang(name),
			body : html,
			yesBtn : {
				name : self.lang('yes'),
				click : function(e) {
					self[checkbox[0].checked ? 'html' : 'insertHtml'](selectBox.val()).hideDialog().focus();
				}
			}
		});
		var selectBox = K('select', dialog.div),
			checkbox = K('[name="replaceFlag"]', dialog.div),
			templateBox = K('.ke-temp-preview', dialog.div)
			;
		checkbox[0].checked = false;
		templateBox.html(selectBox.val())
		selectBox.change(function() {
			templateBox.html(this.value)
		});
	});
});
