/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2011 kindsoft.net
*
* @author Roddy <luolonghao@gmail.com>
* @site http://www.kindsoft.net/
* @licence http://www.kindsoft.net/license.php
*******************************************************************************/


(function(K) {
    function KSWFUpload(options) {
        this.init(options);
    }
    K.extend(KSWFUpload, {
        init : function(options) {
            var self = this;
            options.afterError = options.afterError || function(str) {
                alert(str);
            };
            self.options = options;
            self.progressbars = {};

            var handleBtnId = 'ke_multi_upload_btn' + new Date() * 1 + '_' + Math.floor((Math.random()*90000) + 9999);
            var dragBodyId = 'ke_multi_upload_dragbody' + new Date() * 1 + '_' + Math.floor((Math.random()*90000) + 9999);
            var uploadErrorId = 'ke_multi_upload_error' + new Date() * 1 + '_' + Math.floor((Math.random()*90000) + 9999);
            // template
            self.div = K(options.container).html([
                '<div class="ke-swfupload">',
                '<div class="ke-swfupload-top" >',
                '<div class="ke-inline-block ke-swfupload-button" id="'+ handleBtnId +'" style="width: 86px;">',
                //'<input type="button" value="Browse" style="display:none" />',
                '</div>',
                '<div class="ke-inline-block ke-swfupload-desc">' + options.uploadDesc + '</div>',
                '<span class="ke-button-common ke-button-outer ke-swfupload-startupload">',
                '<input type="button" class="ke-button-common ke-button ke-startup-upload-button" value="' + options.startButtonValue + '" />',
                '</span>',
                '</div>',
                '<div class="ke-swfupload-body" id="'+ dragBodyId +'"></div>',
                '<div class="upload-error-result" id="'+uploadErrorId+'"></div>',
                '</div>'
            ].join(''));
            self.bodyDiv = K('.ke-swfupload-body', self.div);

            function showError(itemDiv, msg) {
                K('.ke-status', itemDiv).addClass('upload-error');
                K('.ke-status > div', itemDiv).hide();
                K('.ke-message', itemDiv).addClass('ke-error').show().html(K.escape(msg));
            }

            self.uploader = WebUploader.create({
                // 文件接收服务端。
                server: self.options.uploadUrl,
                // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                pick: '#' + handleBtnId,
                // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
                resize: false,
                fileVal: 'file',
                accept: {
                    title: 'Images',
                    extensions: options.fileTypes.replace(/\*\./g,'').replace(/;/g,','),
                    mimeTypes: 'image/*'
                },
                uploadBeforeSend: function(object, data, headers){
                    headers = options.uploadHeaders || {};
                    data = options.uploadData || {};
                },
                fileNumLimit: options.fileUploadLimit,
                fileSingleSizeLimit: options.fileSizeLimit.replace(/MB/g,'') * 1 * 1024 *1024
            });
            
            if(self.options.uploadCompress !== undefined){
                self.uploader.options.compress = self.options.uploadCompress;
            }

            self.uploader.on('fileQueued', function(file){
                self.uploader.makeThumb( file, function( error, src ) {
                    if(error){
                        src = self.options.fileIconUrl;
                    }
                    file.url = src;
                    self.appendFile(file);
                }, 80, 80);
            });
            self.uploader.on('uploadStart', function(file){
                var self = this;
                var itemDiv = K('div[data-id="' + file.id + '"]', self.bodyDiv);
                K('.ke-status > div', itemDiv).hide();
                K('.ke-progressbar', itemDiv).show();
            });
            self.uploader.on('uploadProgress', function( file, percentage ) {
                var progressbar = self.progressbars[file.id];
                var percent = Math.floor(percentage * 100);
                progressbar.bar.css('width', percent + '%');
                var barText = percent>=100 ? '上传成功' : percent + '%';
                progressbar.percent.html(barText).show();
            });
            self.uploader.on('uploadSuccess', function(file, response){
                var itemDiv = K('div[data-id="' + file.id + '"]', self.bodyDiv).eq(0);
                var data = response.data;
                if (data.error !== 0) {
                    showError(itemDiv, data.message || self.options.errorMessage);
                    return;
                }
                var resultUrl = data.url;
                // console.info('self.options.formatUploadUrl', self.options.formatUploadUrl)
                if (self.options.formatUploadUrl) {
                    resultUrl = file.url = K.formatUrl(data.url, 'absolute');
                } else {
                    resultUrl = file.url = data.url;
                }


                K('.ke-img', itemDiv).attr('src', file.url).attr('data-status', "1").data('data', {
                    url: resultUrl,
                    title: file.name + '',
                    width: (file._info || {width:'auto'}).width + '',
                    height: '', //(file._info || {height:'auto'}).height 不设置宽度，让其自适应
                    border: '',
                    align:''
                });
            });
            self.uploader.on('uploadError', function(file, reson){
                if (file) {
                    var itemDiv = K('div[data-id="' + file.id + '"]', self.bodyDiv).eq(0);
                    console.info ('reason',reson);
                    showError(itemDiv, 'ERROR:' + reson);
                }
            });
            self.uploader.on('error', function(type){
                var error = '部分或全部文件上传出现错误，请检查后重试！';
                if(type === 'Q_TYPE_DENIED'){
                    //文件类型不正确
                    error = ('['+arguments[1].name +']文件类型不正确，上传失败！')
                }
                else if (type === 'Q_EXCEED_NUM_LIMIT'){
                    error = ('同时最多可上传'+ options.fileUploadLimit +'张图片，超出部分已经忽略！');
                }
                else if(type === "F_EXCEED_SIZE"){
                    error = ('['+arguments[2].name +']文件大小超出限制（最大'+ options.fileSizeLimit.replace(/MB/g,'') * 1  +'M），上传失败！')
                }
                else if(type === "F_DUPLICATE"){
                    error = ('['+arguments[1].name +']文件已存在于待上传列表中！')
                }
                
                console.error('部分或全部文件上传出现错误，请检查后重试！', arguments);
                //K("#" + uploadErrorId).addClass('show').html(error);
                alert(error);
            });

            K('.ke-swfupload-startupload input', self.div).click(function() {
                self.uploader.upload();
            });
        },
        removeFile : function(fileId) {
            var self = this;
            self.uploader.cancelFile(fileId);
            var itemDiv = K('div[data-id="' + fileId + '"]', self.bodyDiv);
            K('.ke-photo', itemDiv).unbind();
            K('.ke-delete', itemDiv).unbind();
            itemDiv.remove();
        },
        removeFiles : function() {
            var self = this;
            K('.ke-item', self.bodyDiv).each(function() {
                self.removeFile(K(this).attr('data-id'));
            });
        },
        appendFile : function(file) {
            var self = this;
            var itemDiv = K('<div class="ke-inline-block ke-item" draggable="false" data-id="' + file.id + '"></div>');
            self.bodyDiv.append(itemDiv);
            var photoDiv = K('<div class="ke-inline-block ke-photo"></div>')
                .mouseover(function(e) {
                    K(this).addClass('ke-on');
                })
                .mouseout(function(e) {
                    K(this).removeClass('ke-on');
                });
            itemDiv.append(photoDiv);

            var img = K('<img class="ke-multi-image ke-img" src="' + file.url + '" class="ke-img" draggable="false" data-status="0" alt="' + file.name + '" />');
            photoDiv.append(img);
            K('<span class="ke-delete"></span>').appendTo(photoDiv).click(function() {
                self.removeFile(file.id);
            });
            var statusDiv = K('<div class="ke-status"></div>').appendTo(photoDiv);
            // progressbar
            K(['<div class="ke-progressbar">',
                '<div class="ke-progressbar-bar"><div class="ke-progressbar-bar-inner"></div></div>',
                '<div class="ke-progressbar-percent">0%</div></div>'].join('')).hide().appendTo(statusDiv);
            // message
            K('<div class="ke-message">' + self.options.pendingMessage + '</div>').appendTo(statusDiv);

            itemDiv.append('<div class="ke-name">' + file.name + '</div>');

            self.progressbars[file.id] = {
                bar : K('.ke-progressbar-bar-inner', photoDiv),
                percent : K('.ke-progressbar-percent', photoDiv)
            };
        },
        remove : function() {
            var self = this;
            self.removeFiles();
            self.destroy();
            self.div.html('');
        },
        getUrlList : function() {
            var list = [];
            K('.ke-img', self.bodyDiv).each(function() {
                var img = K(this);
                var status = img.attr('data-status');
                if (status == "1") {
                    list.push(img.data('data'));
                }
            });
            return list;
        },
        destroy : function(){
            var self = this;
            self.uploader.destroy();
        }
    });

    K.swfupload = function(element, options) {
        return new KSWFUpload(element, options);
    };
})(KindEditor);
KindEditor.plugin('multiimage', function(K) {
	var self = this, name = 'multiimage',
		formatUploadUrl = K.undef(self.formatUploadUrl, true),
		uploadJson = K.undef(self.uploadJson, self.basePath + 'php/upload_json.php'),
		uploadHeader = K.undef(self.uploadHeader, self.basePath + 'php/upload_json.php'),
		uploadData = K.undef(self.uploadData, self.basePath + 'php/upload_json.php'),
		imgPath = self.pluginsPath + 'multiimage/images/',
		imageSizeLimit = K.undef(self.imageSizeLimit, '1MB'),
		imageFileTypes = K.undef(self.imageFileTypes, '*.jpg;*.gif;*.png'),
		imageUploadLimit = K.undef(self.imageUploadLimit, 20),
		filePostName = K.undef(self.filePostName, 'imgFile'),
		lang = self.lang(name + '.');
	self.plugin.multiImageDialog = function(options) {
		var clickFn = options.clickFn,
			uploadDesc = K.tmpl(lang.uploadDesc, {uploadLimit : imageUploadLimit, sizeLimit : imageSizeLimit});
		var html = [
			'<div style="padding:10px 20px;">',
			'<div class="swfupload">',
			'</div>',
			'</div>'
		].join('');
		var dialog = self.createDialog({
			name : name,
			width : 650,
			height : 500,
			title : self.lang(name),
			body : html,
			previewBtn : {
				name : lang.insertAll,
				click : function(e) {
					clickFn.call(self, swfupload.getUrlList());
				}
			},
			yesBtn : {
				name : lang.clearAll,
				click : function(e) {
					swfupload.removeFiles();
				}
			},
			beforeRemove : function() {
				// IE9 bugfix: https://github.com/kindsoft/kindeditor/issues/72
				// if (!K.IE || K.V <= 8) {
				swfupload.destroy();
				// }
			}
		}),
		div = dialog.div;

		var swfupload = K.swfupload({
			container : K('.swfupload', div),
			buttonImageUrl : imgPath + (self.langType == 'zh-CN' ? 'select-files-zh-CN.png' : 'select-files-en.png'),
			buttonWidth : self.langType == 'zh-CN' ? 72 : 88,
			buttonHeight : 23,
			fileIconUrl : imgPath + 'image.png',
			uploadDesc : uploadDesc,
			startButtonValue : lang.startUpload,
			uploadUrl : K.addParam(uploadJson, 'dir=image'),
			uploadData : uploadData,
			uploadHeader : uploadHeader,
            uploadCompress: self.uploadCompress,
            formatUploadUrl: self.formatUploadUrl,
			flashUrl : imgPath + 'swfupload.swf',
			filePostName : filePostName,
			fileTypes : '*.jpg;*.jpeg;*.gif;*.png;*.bmp',
			fileTypesDesc : 'Image Files',
			fileUploadLimit : imageUploadLimit,
			fileSizeLimit : imageSizeLimit,
			postParams :  K.undef(self.extraFileUploadParams, {}),
			queueLimitExceeded : lang.queueLimitExceeded,
			fileExceedsSizeLimit : lang.fileExceedsSizeLimit,
			zeroByteFile : lang.zeroByteFile,
			invalidFiletype : lang.invalidFiletype,
			unknownError : lang.unknownError,
			pendingMessage : lang.pending,
			errorMessage : lang.uploadError,
			afterError : function(html) {
				self.errorDialog(html);
			}
		});


		K(swfupload.bodyDiv).bind('drop', function(kEvt){
			kEvt.preventDefault();
			kEvt.event.preventDefault();
			var files = [];
			[].forEach.call(kEvt.event.dataTransfer.files, function(file) {
				files.push(file);
			},false);
			files.length > 0 && swfupload.uploader.addFiles(files);
			K(swfupload.bodyDiv).removeClass('drag-hover');
		});
		K(swfupload.bodyDiv).bind('dragenter', function(kEvt){
			K(swfupload.bodyDiv).addClass('drag-hover');
		});
		K(swfupload.bodyDiv).bind('dragover', function(event){
			event.preventDefault();
		});
		K(swfupload.bodyDiv).bind('dragleave', function(){
			K(swfupload.bodyDiv).removeClass('drag-hover');
		});
		K(swfupload.bodyDiv).bind('mouseleave', function(){
			K(swfupload.bodyDiv).removeClass('drag-hover');
		});
		K(swfupload.bodyDiv).bind('mouseout', function(){
			K(swfupload.bodyDiv).removeClass('drag-hover');
		});
		return dialog;
	};
	self.clickToolbar(name, function() {
		self.plugin.multiImageDialog({
			clickFn : function (urlList) {
				if (urlList.length === 0) {
					return;
				}
				K.each(urlList, function(i, data) {
					if (self.afterUpload) {
						self.afterUpload.call(self, data.url, data, 'multiimage');
					}
					self.exec('insertimage', data.url, data.title, data.width, data.height, data.border, data.align, 'ke-image', "p");
				});
				// Bugfix: [Firefox] 上传图片后，总是出现正在加载的样式，需要延迟执行hideDialog
				setTimeout(function() {
					self.hideDialog().focus();
				}, 0);
			}
		});
	});
});