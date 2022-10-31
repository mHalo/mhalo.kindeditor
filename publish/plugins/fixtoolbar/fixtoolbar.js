/**
 * Created by chenyihong on 14/12/4.
 */

KindEditor.plugin('fixtoolbar', function (K) {
    var self = this,fixToolBarWatchRef = K("body");
    if (!self.fixToolBar) {
        return;
    }
    if(self.fixToolBarWatchRef){
        fixToolBarWatchRef = K(self.fixToolBarWatchRef);
    }
    var watcher = K(fixToolBarWatchRef);
    if(watcher.length < 1){
        console.error('fixToolBarWatchRef can not be null');
        return
    }

    function init() {
        var toolbar = K('.ke-toolbar'),
            container = K(toolbar).parent();
        var toolbarWidth = K('.ke-toolbar').width();
        toolbar.css('width', (K(container).width() - 2)+ 'px');

        K(window).bind('resize', function(){
            toolbar.css('width', (K(container).width() - 2) + 'px');
        })

        K(watcher).bind('scroll', function () {
            var originY = container.pos().y;
            var watcherY =  watcher.pos().y;
            if(originY <= watcherY){
                toolbar.css('position', 'fixed');
                toolbar.css('top', watcherY + 'px');
                toolbar.css('border-top','1px solid #ccc');
            }else{
                toolbar.css('position', 'static');
                toolbar.css('top', 'auto');
                toolbar.css('border-top','none');
            }
        });
    }

    if (self.isCreated) {
        init();
    } else {
        self.afterCreate(init);
    }

});
