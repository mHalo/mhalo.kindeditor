/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2011 kindsoft.net
*
* @author Roddy <luolonghao@gmail.com>
* @site http://www.kindsoft.net/
* @licence http://www.kindsoft.net/license.php
*******************************************************************************/

KindEditor.plugin('image', function(K) {
	var self = this, name = 'image',
		allowImageUpload = K.undef(self.allowImageUpload, true),
		allowImageRemote = K.undef(self.allowImageRemote, true),
		allowFileManager = K.undef(self.allowFileManager, false),


		uploadHeader = K.undef(self.uploadHeader,{}),
		uploadFileSizeLimit= K.undef(self.uploadFileSizeLimit, '2MB'),
		uploadFileTypeLimit= K.undef(self.uploadFileTypeLimit, '*.jpg;*.gif;*.png;*.jpeg,*.bmp'),
		extraParams = K.undef(self.extraFileUploadParams, {}),
		filePostName = K.undef(self.filePostName, 'imgFile'),
		uploadJson = K.undef(self.uploadJson, self.basePath + '_404.html'),
		formatUploadUrl = K.undef(self.formatUploadUrl, true),


		imageTabIndex = K.undef(self.imageTabIndex, 1), /**为0时默认显示网络图片，为1时默认显示本地上传 */
		imgPath = self.pluginsPath + 'image/images/',
		fillDescAfterUploadImage = K.undef(self.fillDescAfterUploadImage, false),
		lang = self.lang(name + '.');

	self.plugin.imageDialog = function(options) {
		var 
			// imageUrl = options.imageUrl,
			// imageWidth = K.undef(options.imageWidth, ''),
			// imageHeight = K.undef(options.imageHeight, ''),
			// imageTitle = K.undef(options.imageTitle, ''),
			// imageAlign = K.undef(options.imageAlign, ''),
			showRemote = K.undef(options.showRemote, true),
			showLocal = K.undef(options.showLocal, true),
			tabIndex = K.undef(options.tabIndex, 0),
			clickFn = options.clickFn;
		var target = 'kindeditor_upload_iframe_' + new Date().getTime();
		var hiddenElements = [];
		for(var k in extraParams){
			hiddenElements.push('<input type="hidden" name="' + k + '" value="' + extraParams[k] + '" />');
		}
		var html = [
			'<div style="padding:20px;">',
			//tabs
			'<div class="tabs"></div>',
			//remote image - start
			'<div class="tab1" style="display:none;">',
			//url
			'<div class="ke-dialog-row">',
			'<label for="remoteUrl" style="width:60px;">' + lang.remoteUrl + '</label>',
			'<input type="text" id="remoteUrl" class="ke-input-text" name="url" value="" style="width:'+ (allowFileManager ? 250 : 360) +'px;" />',
			'<span class="ke-button-common ke-button-outer"  style="margin-left:'+ (allowFileManager ? 12 : 0) +'px">',
			'<input type="button" class="ke-button-common ke-button" name="viewServer" value="' + lang.viewServer + '" />',
			'</span>',
			'</div>',
			//size
			'<div class="ke-dialog-row">',
			'<label for="remoteWidth" style="width:60px;">' + lang.size + '</label>',
			lang.width + '：<input type="text" id="remoteWidth" class="ke-input-text ke-input-number" name="width" value="" maxlength="4" style="width:130px;margin-right:10px" />',
			lang.height + '：<input type="text" class="ke-input-text ke-input-number" name="height" value="" maxlength="4" style="width:130px;margin-right:10px" />',
			'<span class="ke-inline-block ke-toolbar-icon icon-ke-font ke-icon-refresh-bold ke-refresh-btn"></span>',
			'</div>',
			//align
			'<div class="ke-dialog-row">',
			'<label style="width:60px;">' + lang.align + '</label>',
			'<input type="radio" name="align" class="ke-inline-block" value="" checked="checked" /><span class="ke-inline-block ke-toolbar-icon icon-ke-font ke-icon-float-default"></span><text style="margin-right:30px;">&nbsp;默认</text>',
			' <input type="radio" name="align" class="ke-inline-block" value="left" /><span class="ke-inline-block ke-toolbar-icon icon-ke-font ke-icon-float-left"></span><text style="margin-right:30px;">&nbsp;左对齐</text>',
			' <input type="radio" name="align" class="ke-inline-block" value="right" /><span class="ke-inline-block ke-toolbar-icon icon-ke-font ke-icon-float-right"></span><text style="margin-right:30px;" >&nbsp;右对齐</text>',
			'</div>',
			//title
			'<div class="ke-dialog-row">',
			'<label for="remoteTitle" style="width:60px;">' + lang.imgTitle + '</label>',
			'<input type="text" id="remoteTitle" class="ke-input-text" name="title" value="" style="width:360px;" />',
			'</div>',
			'</div>',
			//remote image - end
			//local upload - start
			'<div class="tab2" style="display:none;">',
			// '<iframe name="' + target + '" style="display:none;"></iframe>',
			// '<form class="ke-upload-area ke-form" method="post" enctype="multipart/form-data" target="' + target + '" action="' + K.addParam(uploadJson, 'dir=image') + '">',
			//file
			'<div class="ke-dialog-row">',
			// hiddenElements.join(''),
			'<label style="width:60px;">' + lang.localUrl + '</label>',
			'<input type="text" name="localUrl" class="ke-input-text" tabindex="-1" style="width:270px;" readonly="true" /> &nbsp;',
			'<input type="button" class="ke-upload-button" value="' + lang.upload + '" />',
			'</div>',
			// '</form>',
			'</div>',
			//local upload - end
			'</div>'
		].join('');
		var dialogWidth = 480,
			dialogHeight = showRemote ? 340 : 220;
		var dialog = self.createDialog({
			name : name,
			width : dialogWidth,
			height : dialogHeight + 3,
			title : self.lang(name),
			body : html,
			yesBtn : {
				name : self.lang('yes'),
				click : function(e) {
					// Bugfix: http://code.google.com/p/kindeditor/issues/detail?id=319
					if (dialog.isLoading) {
						return;
					}
					// insert local image
					if (showLocal && showRemote && tabs && tabs.selectedIndex === 1 || !showRemote) {
						if (uploadbutton.fileBox.val() == '') {
							alert(self.lang('pleaseSelectFile'));
							return;
						}
						dialog.showLoading(self.lang('uploadLoading'));
						uploadbutton.submit();
						localUrlBox.val('');
						return;
					}
					// insert remote image
					var url = K.trim(urlBox.val()),
						width = widthBox.val(),
						height = heightBox.val(),
						title = titleBox.val(),
						align = '';
					alignBox.each(function() {
						if (this.checked) {
							align = this.value;
							return false;
						}
					});
					if (url == 'http://' || K.invalidUrl(url)) {
						alert(self.lang('invalidUrl'));
						urlBox[0].focus();
						return;
					}
					if (!/^\d*$/.test(width)) {
						alert(self.lang('invalidWidth'));
						widthBox[0].focus();
						return;
					}
					if (!/^\d*$/.test(height)) {
						alert(self.lang('invalidHeight'));
						heightBox[0].focus();
						return;
					}
					clickFn.call(self, url, title, width, height, 0, align);
				}
			},
			beforeRemove : function() {
				viewServerBtn.unbind();
				widthBox.unbind();
				heightBox.unbind();
				refreshBtn.unbind();
			}
		}),
		div = dialog.div;

		var urlBox = K('[name="url"]', div),
			localUrlBox = K('[name="localUrl"]', div),
			viewServerBtn = K('[name="viewServer"]', div),
			widthBox = K('.tab1 [name="width"]', div),
			heightBox = K('.tab1 [name="height"]', div),
			refreshBtn = K('.ke-refresh-btn', div),
			titleBox = K('.tab1 [name="title"]', div),
			alignBox = K('.tab1 [name="align"]', div);

		var tabs;
		if (showRemote && showLocal) {
			tabs = K.tabs({
				src : K('.tabs', div),
				afterSelect : function(i) {}
			});
			tabs.add({
				title : lang.remoteImage,
				panel : K('.tab1', div)
			});
			tabs.add({
				title : lang.localImage,
				panel : K('.tab2', div)
			});
			tabs.select(tabIndex);
		} else if (showRemote) {
			K('.tab1', div).show();
		} else if (showLocal) {
			K('.tab2', div).show();
		}

		var uploadbutton = K.uploadbutton({
			button : K('.ke-upload-button', div)[0],
			// form : K('.ke-form', div),
			// target : target,
			width: 'auto',

			fieldName : filePostName,
			fileSizeLimit: uploadFileSizeLimit,
			fileTypeLimit: uploadFileTypeLimit,
			uploadHeader: uploadHeader,
			uploadData: extraParams,
			uploadUrl : K.addParam(uploadJson, 'dir=image'),

			afterUpload : function(data) {
				dialog.hideLoading();
				if (data.error === 0) {
					var url = data.url;
					if (formatUploadUrl) {
						url = K.formatUrl(url, 'absolute');
					}
					if (self.afterUpload) {
						self.afterUpload.call(self, url, data, name);
					}
					if (!fillDescAfterUploadImage) {
						clickFn.call(self, url, data.title, data.width, data.height, data.border, data.align);
					} else {
						K(".ke-dialog-row #remoteUrl", div).val(url);
						K(".ke-tabs-li", div)[0].click();
						K(".ke-refresh-btn", div).click();
					}
				} else {
					alert(data.message);					
					setTimeout(function(){
						localUrlBox.val('');
					}, 100);
				}
			},
			afterError : function(html) {
				dialog.hideLoading();
				self.errorDialog(html);
			}
		});
		uploadbutton.fileBox.change(function(e) {
			localUrlBox.val(uploadbutton.fileBox.val());
		});
		if (allowFileManager) {
			viewServerBtn.click(function(e) {
				self.loadPlugin('filemanager', function() {
					self.plugin.filemanagerDialog({
						viewType : 'VIEW',
						dirName : 'image',
						clickFn : function(url, title) {
							if (self.dialogs.length > 1) {
								K('[name="url"]', div).val(url);
								if (self.afterSelectFile) {
									self.afterSelectFile.call(self, url);
								}
								self.hideDialog();
							}
						}
					});
				});
			});
		} else {
			viewServerBtn.hide();
		}
		var originalWidth = 0, originalHeight = 0,
			naturalWidth = 0, naturalHeight = 0;
		var naturalImage = self.plugin.getSelectedImage();
		if(naturalImage && naturalImage.get){
			var _img = naturalImage.get();
			if(_img){
				naturalWidth = _img.naturalWidth;
				naturalHeight = _img.naturalHeight;
				originalWidth = _img.width;
				originalHeight = _img.height;
			}
		}
		function setSize(width, height) {
			if(width) {
				widthBox.val(width);
				originalWidth = width;
			}
			if(height) {
				heightBox.val(height);
				originalHeight = height;
			}
		}
		refreshBtn.click(function(e) {
			if(naturalWidth * naturalHeight > 0){
				setSize(naturalWidth, naturalHeight);
				return
			}
			var tempImg = new Image();
			tempImg.onload = function() {
				setSize(this.width, this.height);
				tempImg = null;
			}
			tempImg.src = urlBox.val();
		});
		widthBox.change(function(e) {
			if (/^\d+$/.test(this.value) && this.value > 0) {
				heightBox.val(Math.round(naturalHeight / naturalWidth * parseInt(this.value, 10)));
			}
		});
		heightBox.change(function(e) {
			if (/^\d+$/.test(this.value) && this.value > 0) {
				widthBox.val(Math.round(naturalWidth / naturalHeight * parseInt(this.value, 10)));
			}
		});
		urlBox.val(options.imageUrl);
		setSize(options.imageWidth, options.imageHeight);
		titleBox.val(options.imageTitle);
		alignBox.each(function() {
			if (this.value === options.imageAlign) {
				this.checked = true;
				return false;
			}
		});
		if (showRemote && tabIndex === 0) {
			urlBox[0].focus();
			urlBox[0].select();
		}
		return dialog;
	};
	self.plugin.image = {
		edit : function() {
			var img = self.plugin.getSelectedImage();
			self.plugin.imageDialog({
				imageUrl : img ? img.attr('data-ke-src') : 'http://',
				imageWidth : img ? img.attr('width') : '',
				imageHeight : img ? img.attr('height') : '',
				imageTitle : img ? img.attr('title') : '',
				imageAlign : img ? img.attr('align') : '',
				showRemote : allowImageRemote,
				showLocal : allowImageUpload,
				tabIndex: img ? 0 : imageTabIndex,
				clickFn : function(url, title, width, height, border, align) {
					if (img) {
						img.attr('src', url);
						img.attr('data-ke-src', url);
						!!width ? img.attr('width', width) : img.removeAttr('width');
						!!height ? img.attr('height', height) : img.removeAttr('height');
						!!title ? img.attr('title', title) : img.removeAttr('title');
						!!align ? img.attr('align', align) : img.removeAttr('align');
						!!title ? img.attr('alt', title) : img.removeAttr('alt');
					} else {
						self.exec('insertimage', url, title, width, height, border, align, 'ke-image');
						setTimeout(function() {
							self.edit.afterChange.call(self.edit);
						}, 300);
					}
					// Bugfix: [Firefox] 上传图片后，总是出现正在加载的样式，需要延迟执行hideDialog
					setTimeout(function() {
						self.hideDialog().focus();
					}, 0);
				}
			});
		},
		'delete' : function() {
			var target = self.plugin.getSelectedImage();
			if (target.parent().name == 'a') {
				target = target.parent();
			}
			target.remove();
			// [IE] 删除图片后立即点击图片按钮出错
			self.addBookmark();
		}
	};
	self.clickToolbar(name, self.plugin.image.edit);
});
