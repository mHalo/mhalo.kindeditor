
function KUploadButton(options) {
	this.init(options);
}
_extend(KUploadButton, {
	init : function(options) {
		var self = this,
			button = K(options.button),
			fieldName = options.fieldName || 'file',
			url = options.url || '',
			title = button.val(),
			extraParams = options.extraParams || {},
			uploadResponseFilter = options.uploadResponseFilter,
			uploadCompress = options.uploadCompress,
			cls = button[0].className || '',
			target = options.target || 'kindeditor_upload_iframe_' + new Date().getTime();
		options.afterError = options.afterError || function(str) {
			alert(str);
		};

		var hiddenElements = [];
		for(var k in extraParams){
			hiddenElements.push('<input type="hidden" name="' + k + '" value="' + extraParams[k] + '" />');
		}

		var html = [
			'<div class="ke-inline-block ' + cls + '">',
			(options.target ? '' : '<iframe name="' + target + '" style="display:none;"></iframe>'),
			(options.form ? '<div class="ke-upload-area">' : '<form class="ke-upload-area ke-form" method="post" enctype="multipart/form-data" target="' + target + '" action="' + url + '">'),
			'<span class="ke-button-common">',
			hiddenElements.join(''),
			'<input type="button" class="ke-button-common ke-button" value="' + title + '" />',
			'</span>',
			'<input type="file" class="ke-upload-file" name="' + fieldName + '" tabindex="-1" />',
			(options.form ? '</div>' : '</form>'),
			'</div>'].join('');

		var div = K(html, button.doc);
		button.hide();
		button.before(div);

		self.div = div;
		self.button = button;
		// self.iframe = options.target ? K('iframe[name="' + target + '"]') : K('iframe', div);
		self.fileBox = K('.ke-upload-file', div);
		self.form = options.form ? K(options.form) : K('form', div);

		var fileSizeLimit = K.undef(options.fileSizeLimit, '1MB'),
			fileTypeLimit = K.undef(options.fileTypeLimit, '*.jpg;*.gif;*.png');
		self.uploader = WebUploader.create({
			// 文件接收服务端。
			server: options.uploadUrl,
			// 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
			resize: false,
			fileVal: 'file',
			accept: {
				title: 'Images',
				extensions: fileTypeLimit.replace(/\*\./g,'').replace(/;/g,','),
				mimeTypes: 'image/*'
			},
			headers: options.uploadHeader,
			formData: options.uploadData,
			fileNumLimit: 1,
			fileSingleSizeLimit: fileSizeLimit.replace(/MB/g,'') * 1 * 1024 *1024
		});

		if(uploadCompress !== undefined){
			self.uploader.options.compress = uploadCompress;
		}
		
		self.uploader.on('uploadStart', function(file){
			
		});
		self.uploader.on('uploadSuccess', function(file, response){
			var resData = response;
			if(uploadResponseFilter){
				resData = uploadResponseFilter.call(null, response)
			}
			self.options.afterUpload.call(self, resData);
		});

		self.uploader.on('uploadError', function(file, response){
			self.options.afterUpload.call(self, {
				error: 1,
				message: '[http-error]图片上传失败！'
			});
		});
		
		self.uploader.on('error', function(type){
			var error = '文件上传出现错误，请检查后重试！';
			if(type === 'Q_TYPE_DENIED'){
				//文件类型不正确
				error = ('['+arguments[1].name +']文件类型不正确！')
			}
			else if(type === "F_EXCEED_SIZE"){
				error = ('文件大小超出限制（最大'+ options.fileSizeLimit.replace(/MB/g,'') * 1  +'M）！')
			}
			else if(type === "F_DUPLICATE"){
				error = ('['+arguments[1].name +']文件已存在于待上传列表中！')
			}
			console.error('文件上传出现错误，请检查后重试！', arguments);
			self.options.afterUpload.call(self, {
				error: 1,
				message: error
			});
			self.uploader.reset();
			self.form && self.form[0] && self.form[0].reset && self.form[0].reset();
		});
		self.fileBox.bind('change', function(){
			self.uploader.reset();
			this.files && self.uploader.addFiles(this.files)
		})
		var width = options.width || K('.ke-button-common', div).width();
		K('.ke-upload-area', div).width(width);
		self.options = options;
	},
	submit : function() {
		var self = this;
		var files = self.uploader.getFiles();
		if(files.length <= 0){
			alert('请选择文件');
			self.uploader.reset();
			return;
		}
		setTimeout(function(){
			self.uploader.upload();
		}, 100);
		return self;
	},
	remove : function() {
		var self = this;
		if (self.fileBox) {
			self.fileBox.unbind();
		}
		// Bugfix: [IE] 上传图片后，进度条一直处于加载状态。
		//self.iframe[0].src = 'javascript:false';
		// self.iframe.remove();
		self.div.remove();
		self.button.show();
		return self;
	}
});

function _uploadbutton(options) {
	return new KUploadButton(options);
}

K.UploadButtonClass = KUploadButton;
K.uploadbutton = _uploadbutton;

