
## 更新日志
v4.4.7 (2023-03-08)
1. 图片编辑窗内，属性编辑的逻辑优化
2. 地图组件BUG修复（iframe方式引入可交互地图的更新已包含在计划中，暂只支持图片的引入方式）
3. 一些优化更新


v4.4.6 (2023-02-24)
1. 调整emoji/symbol插件样式结构

v4.4.3 (2023-02-22)  
1. 增加symbols(特殊字符)插件，**K.Tools.Normal** 配置中已默认包含此插件。symbols信息可按照以下方案进行配置：
```
K.create('#editor', {
    symbolConfig:function(symbols, page){
        page.cols = 9
    },
});
```

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

更早的一些更新：

