/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2011 kindsoft.net
*
* @author MHalo <chinatmall@outlook.com>
* @site http://www.kindsoft.net/
* @licence http://www.kindsoft.net/license.php
*******************************************************************************/

KindEditor.plugin('quote', function(K) {
	var self = this, name = 'quote';
	self.clickToolbar(name, function() {
		self.focus();
		var inner = '\u200B';
		if(self.cmd.range){
			var fragment = self.cmd.range.extractContents();
			inner =  K(fragment).outer();
		}
        self.insertHtml('<blockquote class="ke-quote"><p>'+ inner +'</p></blockquote>').focus();
	});
});
