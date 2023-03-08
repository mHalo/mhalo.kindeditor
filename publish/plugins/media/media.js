/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2011 kindsoft.net
*
* @author Roddy <luolonghao@gmail.com>
* @site http://www.kindsoft.net/
* @licence http://www.kindsoft.net/license.php
*******************************************************************************/

KindEditor.plugin('media', function(K) {
	var self = this, name = 'media', lang = self.lang(name + '.'),
		allowMediaUpload = K.undef(self.allowMediaUpload, true),
		allowFileManager = K.undef(self.allowFileManager, false),

		uploadHeader = K.undef(self.uploadHeader,{}),
		uploadFileSizeLimit= K.undef(self.uploadFileSizeLimit, '20MB'),
		uploadFileTypeLimit= K.undef(self.uploadFileTypeLimit, '*.mp3;*.wav;*.mp4;*.wmv;*.rmvb;*.avi'),
		extraParams = K.undef(self.extraFileUploadParams, {}),
		filePostName = K.undef(self.filePostName, 'imgFile'),
		uploadJson = K.undef(self.uploadJson, self.basePath + '_404.html'),
		formatUploadUrl = K.undef(self.formatUploadUrl, true);


	var getAncestorTag = function (range) {
		var ancestor = K(range.commonAncestor());
		while (ancestor) {
			if (ancestor.type == 1 && !ancestor.isStyle()) {
				break;
			}
			ancestor = ancestor.parent();
		}
		return ancestor;
	}


	self.plugin.media = {
		edit : function() {
			var html = [
				'<div style="padding:20px;">',
				//url
				'<div class="ke-dialog-row">',
				'<label for="keUrl" style="width:60px;">' + lang.url + '</label>',
				'<input class="ke-input-text" type="text" id="keUrl" name="url" value="" style="width:'+ (allowFileManager ? 160 : 260) +'px;" />',
				'<input type="button" class="ke-upload-button" value="' + lang.upload + '" />',
				'<span class="ke-button-common ke-button-outer"  style="margin-left:'+ (allowFileManager ? 5 : 0) +'px" >',
				'<input type="button" class="ke-button-common ke-button " name="viewServer" value="' + lang.viewServer + '" />',
				'</span>',
				'</div>',
				//width
				'<div class="ke-dialog-row">',
				'<label for="keWidth" style="width:60px;">' + lang.width + '</label>',
				'<input type="text" id="keWidth" class="ke-input-text ke-input-number" name="width" value="320" maxlength="4" />',
				// '</div>',
				// //height
				// '<div class="ke-dialog-row">',
				'<label for="keHeight" style="width:60px;text-align:left;margin-left:30px">' + lang.height + '</label>',
				'<input type="text" id="keHeight" class="ke-input-text ke-input-number" name="height" value="auto" maxlength="4" />',
				'</div>',
				//autostart & preload
				'<div class="ke-dialog-row">',
				'<label for="kePreload" style="width:60px;">预加载</label>',
				'<div style="width:80px;display:inline-block;"><input type="checkbox" id="kePreload" name="preload" value="" /></div>',
				'<label for="keAutostart" style="width:60px;text-align:left;margin-left:30px">自动播放</label>',
				'<div style="width:80px;display:inline-block;"><input type="checkbox" id="keAutostart" name="autoplay" value="" /></div>',
				'</div>',
				//controls & loop
				'<div class="ke-dialog-row">',
				'<label for="keControls" style="width:60px;">控制按钮</label>',
				'<div style="width:80px;display:inline-block;"><input type="checkbox" id="keControls" name="controls" checked value="" /></div>',
				'<label for="keLoop" style="width:60px;text-align:left;margin-left:30px">循环播放</label>',
				'<div style="width:80px;display:inline-block;"><input type="checkbox" id="keLoop" name="loop" checked value="" /></div>',
				'</div>',
				'</div>'
			].join('');
			var dialog = self.createDialog({
				name : name,
				width : 450,
				height : 300,
				title : self.lang(name),
				body : html,
				yesBtn : {
					name : self.lang('yes'),
					click : function(e) {
						var url = K.trim(urlBox.val()),
							width = widthBox.val(),
							height = heightBox.val(),
							preload = preloadBox[0].checked,
							autoplay = autostartBox[0].checked,
							controls = controlsBox[0].checked,
							loop = loopBox[0].checked
							;
						if (url == 'http://' || K.invalidUrl(url)) {
							alert(self.lang('invalidUrl'));
							urlBox[0].focus();
							return;
						}
						if (width != 'auto' && !/^\d*$/.test(width)) {
							alert(self.lang('invalidWidth'));
							widthBox[0].focus();
							return;
						}
						if (height != 'auto' &&!/^\d*$/.test(height)) {
							alert(self.lang('invalidHeight'));
							heightBox[0].focus();
							return;
						}
						var mediaType = "video";
						if (/\.(mp3|wav|ogg|acc)(\?|$)/i.test(url)){
							mediaType = "audio";
						}

						var html = [
							'<p><' + mediaType,
							'data-ke-class="ke-audio"',
							'class="ke-media"',
							'style="display:inline;"',
							'src="'+ url +'"',
							'width="'+ width +'"',
							'height="'+ height +'"',
							preload ? 'preload' : '',
							autoplay ? 'autoplay' : '',
							controls ? 'controls' : '',
							loop ? 'loop' : '',
							'></' + mediaType + '><span>\u200B　</span></p>'
						].join(' ');
						
						var tag = getAncestorTag(self.cmd.range);
						if(tag && tag.name!= 'p'){
							self.insertHtml(html).hideDialog().focus();
						}else{
							K(tag).after(html)
							self.hideDialog().focus();
						}
					}
				}
			}),
			div = dialog.div,
			urlBox = K('[name="url"]', div),
			viewServerBtn = K('[name="viewServer"]', div),
			widthBox = K('[name="width"]', div),
			heightBox = K('[name="height"]', div),
			autostartBox = K('[name="autoplay"]', div),
			preloadBox = K('[name="preload"]', div),
			controlsBox = K('[name="controls"]', div),
			loopBox = K('[name="loop"]', div);

			urlBox.val('http://');

			if (allowMediaUpload) {
				var uploadbutton = K.uploadbutton({
					button : K('.ke-upload-button', div)[0],
					width: 'auto',

					fieldName : filePostName,
					fileSizeLimit: uploadFileSizeLimit,
					fileTypeLimit: uploadFileTypeLimit,
					uploadHeader: uploadHeader,
					uploadData: extraParams,
					uploadUrl : K.addParam(uploadJson, 'dir=media'),

					afterUpload : function(data) {
						dialog.hideLoading();
						if (data.error === 0) {
							var url = data.url;
							if (formatUploadUrl) {
								url = K.formatUrl(url, 'absolute');
							}
							urlBox.val(url);
							if (self.afterUpload) {
								self.afterUpload.call(self, url, data, name);
							}
							// alert(self.lang('uploadSuccess'));
						} else {
							alert(data.message);			
							setTimeout(function(){
								urlBox.val('http://');
							}, 100);
						}
					},
					afterError : function(html) {
						dialog.hideLoading();
						self.errorDialog(html);
					}
				});
				uploadbutton.fileBox.change(function(e) {
					var uploadFile = K("input[type='file']", uploadbutton.form[0]).val()
					if(uploadFile){
						dialog.showLoading(self.lang('uploadLoading'));
						uploadbutton.submit();
					}
				});
			} else {
				K('.ke-upload-button', div).hide();
			}

			if (allowFileManager) {
				viewServerBtn.click(function(e) {
					self.loadPlugin('filemanager', function() {
						self.plugin.filemanagerDialog({
							viewType : 'LIST',
							dirName : 'media',
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

			// var img = self.plugin.getSelectedMedia();
			// if (img) {
			// 	var attrs = K.mediaAttrs(img.attr('data-ke-tag'));
			// 	urlBox.val(attrs.src);
			// 	widthBox.val(K.removeUnit(img.css('width')) || attrs.width || 0);
			// 	heightBox.val(K.removeUnit(img.css('height')) || attrs.height || 0);
			// 	autostartBox[0].checked = (attrs.autostart === 'true');
			// }
			// urlBox[0].focus();
			// urlBox[0].select();
		},
		'delete' : function() {
			self.plugin.getSelectedMedia().remove();
			// [IE] 删除图片后立即点击图片按钮出错
			self.addBookmark();
		}
	};
	self.clickToolbar(name, self.plugin.media.edit);
});
