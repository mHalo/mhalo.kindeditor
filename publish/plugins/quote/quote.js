/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2011 kindsoft.net
*
* @author MHalo <chinatmall@outlook.com>
* @site http://www.kindsoft.net/
* @licence http://www.kindsoft.net/license.php
*******************************************************************************/

KindEditor.plugin('quote', function(K) {
	var self = this, name = 'quote',
		doc = self.edit.doc;
    function getAncestorTag(range) {
        var ancestor = K(range.commonAncestor());
        while (ancestor) {
            if (ancestor.type == 1 && !ancestor.isStyle()) {
                break;
            }
            ancestor = ancestor.parent();
        }
        return ancestor;
    }
	self.clickToolbar(name, function() {
		self.focus();
		var inner = '\u200B',
            range = self.cmd.range;;
        var tag = getAncestorTag(self.cmd.range);
		if(range){
			var fragment = range.extractContents();
            var outer = K(fragment).outer();
            inner = outer ? outer :K(fragment).html();
		}
        inner = inner || "\u200B";
        var html = '<blockquote style="padding: 0 1.5em;border-left: 5px solid #ddd;font-style: italic;margin-block-start: 0;margin-inline-start: 0;min-height: 2rem"><p>'+ inner +'</p></blockquote>';
        if(tag && ["p","h1","h2","h3", "h4", "h5", "h6"].indexOf(tag.name) > -1){
            K(tag).after(html);
            var insert = K(tag).next();
			self.cmd.range.selectNodeContents(insert).collapse();
			self.cmd.select();
            insert.focus();
        }else{
            self.insertHtml(html)
            var forcusTarget = tag;
            while(forcusTarget && forcusTarget.children && forcusTarget.children().length){
                forcusTarget = forcusTarget.children()
            }
			forcusTarget && forcusTarget[0] && self.cmd.range.selectNodeContents(forcusTarget[0]).collapse();
			self.cmd.select();
        }
		self.cmd.selection(true);
	});
});
