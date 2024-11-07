<div align="center" border="none">
<h1 align="center">MHalo.KindEditor</h1>
<p align="center">
  <a href="https://npmcharts.com/compare/mhalo.kindeditor?minimal=true"><img src="https://img.shields.io/npm/dm/mhalo.kindeditor.svg?sanitize=true" alt="Downloads"></a>
    <a href="https://www.npmjs.com/package/mhalo.kindeditor"><img src="https://img.shields.io/npm/v/mhalo.kindeditor.svg?sanitize=true" alt="Version"></a>
    <a href="https://www.npmjs.com/package/mhalo.kindeditor"><img src="https://img.shields.io/npm/l/mhalo.kindeditor.svg?sanitize=true" alt="License"></a>
</p>
</div>

## 🔵 What is KindEditor?

KindEditor is a lightweight, Open Source(LGPL), cross browser, web based WYSIWYG HTML editor. KindEditor has the ability to convert standard textareas to rich text editing.  
**Official site**: [http://kindeditor.net/](http://kindeditor.net/)

## 🔴 Break Changes
- @v4.4.15  
工具栏图标文件本地化（不再引用iconfont线上地址）  
图标字体路径: themes -> default -> fonts/*，图标样式包含在default.css文件中  
[点此查看更新详情](https://github.com/mHalo/mhalo.kindeditor/blob/main/UPDATE.md#v4415-2023-05-08)

- @v4.4.8  
上传类接口返回数据格式处理逻辑更新(保持kindeditor默认格式处理)；   
如遇到接口返回数据格式不同的情况，可以增加[**uploadResponseFilter**]参数配置进行处理；  
[点此查看更新详情](https://github.com/mHalo/mhalo.kindeditor/blob/main/UPDATE.md#v448-2023-03-09)

## 🟠 Bug 和需求反馈
如果想要反馈 Bug、提供意见，可以创建 Github issue 或 添加微信(备注KE) 联系，十分感谢！ 

<img src="https://user-images.githubusercontent.com/19524115/224662425-0b5223ca-e775-4331-8250-0779fd02c640.JPG" height="320">

## 🟢 MHalo.KindEditor

MHalo.KindEditor在Kindeditor（[https://github.com/kindsoft/kindeditor](https://github.com/kindsoft/kindeditor) ）的基础上，进行了界面的美化，以及部分插件的优化修改。
具体使用方式与kindeditor无较大差异，可参考[http://kindeditor.net/doc.php](http://kindeditor.net/doc.php)。

> 使用前请移步了解更新日志： [点此查看](./UPDATE.md)

<img width="1066" alt="image" src="https://user-images.githubusercontent.com/19524115/190976990-6089d387-8886-4fda-b6ed-41a541d4ee5a.png">

---

## 特点： 

👉. 插入代码插件prism插件进行高亮转换  
1、插入代码插件结构适配prism，可在内容展示页面通过引入`prism.css`、`prism.js`高亮格式化展示（编辑器结果仍然保持插入的代码内容）；  
2: 支持编辑器内引入prism插件进行高亮转换（编辑器将只储存prism高亮转换后的结果）,在内容展示页面只需要引入`prism.css`即可。根据以下示例进行配置：
```
KindEditor.ready(function (K) {
    var options = {
        prismPath: '../other-plugins/prism',
        //或
        prismPath: 'https://your.website-domain.com/libs/prism',
    };
    var contentEditor = K.create('#editor', options);
});
```
![image-20241107174550495](https://raw.githubusercontent.com/mHalo/mhalo.github.io/master/image-bed/image-20241107174550495.png)


👉. 基于theme/default的样式更新，使用iconfont更新图标样式  
#### 自定义组件图标添加方式：
1. 移步 https://www.iconfont.cn/ 下载所需图标的svg/png文件 
2. 根据图标样式名规则(.ke-icon-[插件定义的name])定义样式：  
<font color="#efac42">以插件plugin-demo为例(注意：关于background的相关样式设置，请务必添加 **!important** )</font>
```
.ke-icon-plugin-demo{
    background: url(./icons-path/plugin.svg) center center no-repeat!important;
    background-size: auto 80%!important;
}
```


👉. KindEditor工具栏便捷配置，可使用**K.Tools.All**、**K.Tools.Normal**、**K.Tools.Small**、**K.Tools.Mini**进行配置
```
KindEditor.ready(function (K) {
    var options = {
        items: K.Tools.All,
        //或基于某个默认配置增加自定义插件
        items: K.Tools.Mini.concat(['plugin-demo']),
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

👉. Image-Uploader图片上传优化（包含多图上传、单图上传）

↦ 单图上传弃用了form提交的方式，多图上传弃用了flash的方式，统一使用webuploader进行上传。  
↦ 由于webuploader中使用了jquery，但jquery体量较大，又考虑到在vue中使用的情况，所以将zepto取必须模块封装在了对应模块中，后期会考虑使用现代浏览器支持的方式自行构建。  
↦ 上传时支持携带formData和Headers，支持客户端限制上传文件大小及文件类型。
```
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
filePostName: 'imgFile',
uploadResponseFilter: function(response){
    return response.data
},
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

---
<h3 align="center">🔗 MHalo.Vue-KindEditor `支持Vue3`</h1>
<p align="center">
👉🏻  <a src="https://github.com/mHalo/mhalo.vue-kindeditor">https://github.com/mHalo/mhalo.vue-kindeditor</a>
</p>
<p align="center">
    <a href="https://npmcharts.com/compare/mhalo.vue-kindeditor?minimal=true"><img src="https://img.shields.io/npm/dm/mhalo.vue-kindeditor.svg?sanitize=true" alt="Downloads"></a>
    <a href="https://www.npmjs.com/package/mhalo.vue-kindeditor"><img src="https://img.shields.io/npm/v/mhalo.vue-kindeditor.svg?sanitize=true" alt="Version"></a>
    <a href="https://www.npmjs.com/package/mhalo.vue-kindeditor"><img src="https://img.shields.io/npm/l/mhalo.vue-kindeditor.svg?sanitize=true" alt="License"></a>
</p>
