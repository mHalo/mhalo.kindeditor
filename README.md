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

MHalo.KindEditor在Kindeditor（[https://github.com/kindsoft/kindeditor](https://github.com/kindsoft/kindeditor) ）的基础上，对界面进行了美化，并对部分插件进行了修改优化。
具体使用方式无较大差异（差异主要集中在文件上传部分），其它可参考（[http://kindeditor.net/doc.php](http://kindeditor.net/doc.php)）。

<img width="1066" alt="image" src="https://user-images.githubusercontent.com/19524115/190976990-6089d387-8886-4fda-b6ed-41a541d4ee5a.png">


---

## 修改的模块： 

1. 基于theme/default的样式更新，更新图标样式
2. KindEditor工具栏配置更新，可使用**K.Tools.All**、**K.Tools.Normal**、**K.Tools.Small**、**K.Tools.Mini**进行配置
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

3. Image-Uploader更新（包含多图上传、单图上传）
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

4. 可引入vite使用
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
**使用方法（待完成）**
```
> 计划在后面会封装为组件，暂时只做引入使用的说明

<template>
    <div :id="id"></div>
</template>
<script setup>
import KindEditor from 'mhalo.kindeditor'
import { onMounted } from 'vue'
const id = "ke_" + Math.random().toString().substr(2)
let editor = null
onMounted(()=>{
    var options = {
        themesPath: '../../node_modules/mhalo.kindeditor/themes/',
        basePath:'../../node_modules/mhalo.kindeditor/',
        pluginsPath: '../../node_modules/mhalo.kindeditor/plugins/',
        allowImageUpload: true,
        minHeight: 120,
        autoHeightMode: true,
        uploadJson: '/handler/upload-test?dir=image',
        uploadHeader:{
            corefx: 'mhalo'
        },
        imageSizeLimit: '2MB',
        items: KindEditor.Tools.All,
        cssData: 'body{font-size: 16px;line-height: 28px;}',
        afterBlur: function () {
            this.sync();
        }
    };
    editor = KindEditor.create('#' + id, options);
})

</script>

```
