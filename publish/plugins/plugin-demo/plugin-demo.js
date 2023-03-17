KindEditor.plugin('plugin-demo', function (K) {
	var self = this;
	var name = 'plugin-demo';
	var pagebreakHtml = K.undef(self.pagebreakHtml, '<hr style="page-break-after: always;" class="ke-pagebreak" />');
	self.clickToolbar(name, function() {
		self.focus();
		self.insertHtml("插件图标示意");
	});
});