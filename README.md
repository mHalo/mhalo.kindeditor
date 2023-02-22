## What is KindEditor?

KindEditor is a lightweight, Open Source(LGPL), cross browser, web based WYSIWYG HTML editor. KindEditor has the ability to convert standard textareas to rich text editing.

## Official site
http://kindeditor.net/

## Contributors

* Timon Lin
* daif alotaibi (http://daif.net/) : Arabic Translation
* fisker (https://github.com/fisker) : QQ style theme
* composite (https://github.com/composite) : Korean Translation

___

## 更新日志
v4.4.1 (2023-02-22)  
1. 修复quote插件工具栏中hover提示undefined
2. 源码增加dist文件夹（/publish/dist），可直接下载使用
3. 将[kindsoft/kindeditor#54](https://github.com/kindsoft/kindeditor/issues/54)中bugfix的处理方式扩展为可配置，默认情况下，设置样式或上传编辑图片时，编辑器不再自动滚动至将编辑内容所在的位置。如需保持原逻辑，可通过一下方式开启：
```
K.create('#editor', {
    scrollToEditingTarget: true,
});
```
4. 增加emoji插件，**K.Tools.Normal** 配置中已默认包含此插件。emoji信息可按照以下方案进行配置：
```
K.create('#editor', {
    emojiConfig:function(emojis, page){
        page.cols = 12
    },
});
```
5. 更新部分样式


## 更新日志
v4.4.0 (2022-11-03)  
1. 修复批量上传图片bug

v4.3.8 (2022-11-03)  
1. 优化包静态资源引用（emoji表情插件已弃用，filemanager静态资源未进行优化），无用资源文件删除，减小包体积
2. 地图插件优化
3. 编辑器界面美化、弹窗样式美化
4. 默认工具栏配置更新


v4.3.5 (2022-11-02)  
1. 修复WebUploader引用bug

v4.3.0 (2022-11-01)  
1. 修复fixToolBar功能，增加[fixToolBarWatchRef]参数，可以指定滚动时监听的对象  
示例 options ->：
```
fixToolBar: true,
fixToolBarWatchRef: '#wrapper',
```

2. 移除flash相关模块
3. 移除部分无用的文件

___

MHalo.KindEditor在Kindeditor（[https://github.com/kindsoft/kindeditor](https://github.com/kindsoft/kindeditor) ）的基础上，对界面进行了美化，并对部分插件进行了修改优化。
具体使用方式无较大差异（差异主要集中在文件上传部分），其它可参考（[http://kindeditor.net/doc.php](http://kindeditor.net/doc.php)）。

<img width="1066" alt="image" src="https://user-images.githubusercontent.com/19524115/190976990-6089d387-8886-4fda-b6ed-41a541d4ee5a.png">


---

## 修改的模块： 

👉. 基于theme/default的样式更新，更新图标样式
👉. KindEditor工具栏配置更新，可使用**K.Tools.All**、**K.Tools.Normal**、**K.Tools.Small**、**K.Tools.Mini**进行配置
```
KindEditor.ready(function (K) {
    var options = {
        items: K.Tools.All,
    };
    var contentEditor = K.create('#editor', options);
});
```
<table>
    <tr>
        <th>Normal</th>
        <th>Small</th>
        <th>Mini</th>
    <tr>
    <tr>
        <td>
            <img width="100%" alt="image" src="https://user-images.githubusercontent.com/19524115/191661412-d0d66f35-9075-4db2-bca1-3d8dc9f6ebb5.png">
        </td>
        <td>
            <img width="100%" alt="image" src="https://user-images.githubusercontent.com/19524115/191661473-e1223879-4007-4620-ae97-3a0bf2de2f67.png">
        </td>
        <td>
            <img width="100%" alt="image" src="https://user-images.githubusercontent.com/19524115/191661506-469344fb-d0be-4955-8482-869a4214c034.png">
        </td>
    </tr>
</table>

👉. Image-Uploader更新（包含多图上传、单图上传）
```
单图上传弃用了form提交的方式，多图上传弃用了flash的方式，两种上传都是用webuploader进行上传
由于webuploader中使用了jquery，但jquery体量较大，又考虑到在vue中使用的情况，所以将zepto取必须模块封装在了对应模块中，
后期会考虑使用现代浏览器支持的方式自行构建uploader，毕竟zepto+webuploader的体积也不小

上传时支持携带formData和Headers，支持限制上传文件大小及文件类型（客户端）：
> options 

uploadJson: '/handler/upload-test?dir=image',
uploadHeader:{
    corefx: 'mhalo'
},
extraFileUploadParams:{
    data: 'demo'
},
uploadFileSizeLimit: '5MB',
uploadFileTypeLimit: '*.jpg;*.gif;*.png;*.jpeg,*.bmp',
filePostName: 'imgFile'
```
<img width="1081" alt="image" src="https://user-images.githubusercontent.com/19524115/191661051-c23222db-ca4c-4015-9614-3cfebc54f274.png">

👉. Media类型上传，使用audio和video标签呈现
> 可设定controls、autoplay、preload、loop参数

<img width="1032" alt="image" src="https://user-images.githubusercontent.com/19524115/198891198-440e7715-cc8c-46cc-98a7-382b23bf41f7.png">


👉. 可引入vite使用
>  kindeditor在发布时封装为了umd格式，为了支持es6 import的引用方式，包入口设置为了index.js，相关代码：  
　  
> import './dist/kindeditor-all-min';  
export default KindEditor ;    
　  
以此实现了es6 import;

**包引入配置：**
```
pnpm i mhalo.kindeditor

> vite.configjs 增加如下配置：

  optimizeDeps: {
    exclude: ['mhalo.kindeditor'], 
  },
  build: {
    commonjsOptions: { 
      exclude: ['mhalo.kindeditor'], 
      transformMixedEsModules: true,
    },
  },

```
