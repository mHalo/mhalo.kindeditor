KindEditor.plugin('plug-demo', function (K) {
	var self = this;
	var name = 'plug-demo';
	var pagebreakHtml = K.undef(self.pagebreakHtml, '<hr style="page-break-after: always;" class="ke-pagebreak" />');
	self.clickToolbar(name, function() {
		var cmd = self.cmd, range = cmd.range;
		self.focus();
		self.insertHtml("插件图标示意");
	});
});