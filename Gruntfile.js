

module.exports = function(grunt) {

var BANNER = `/*
<%= pkg.name %> <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>), 
Copyright (C) kindeditor.net, Licence: http://kindeditor.net/license.php 
*/
`;

var SRC_FILES = [
	'src/header.js',
	'src/upload.js',
	'src/core.js',
	'src/config.js',
	'src/event.js',
	'src/html.js',
	'src/selector.js',
	'src/node.js',
	'src/range.js',
	'src/cmd.js',
	'src/widget.js',
	'src/edit.js',
	'src/toolbar.js',
	'src/menu.js',
	'src/colorpicker.js',
	'src/uploadbutton.js',
	'src/dialog.js',
	'src/tabs.js',
	'src/ajax.js',
	'src/main.js',
	'src/footer.js',
];

var PLUGIN_FILES = [
	'plugins/anchor/anchor.js',
	'plugins/autoheight/autoheight.js',
	'plugins/baidumap/baidumap.js',
	'plugins/clearhtml/clearhtml.js',
	'plugins/code/code.js',
	// 'plugins/emoticons/emoticons.js',
	'plugins/filemanager/filemanager.js',
	'plugins/image/image.js',
	'plugins/insertfile/insertfile.js',
	'plugins/lineheight/lineheight.js',
	'plugins/link/link.js',
	'plugins/media/media.js',
	'plugins/multiimage/multiimage.js',
	'plugins/pagebreak/pagebreak.js',
	'plugins/plainpaste/plainpaste.js',
	'plugins/preview/preview.js',
	'plugins/quote/quote.js',
	'plugins/quickformat/quickformat.js',
	'plugins/table/table.js',
	'plugins/template/template.js',
	'plugins/wordpaste/wordpaste.js',
	'plugins/fixtoolbar/fixtoolbar.js',
	'lang/zh-CN.js'
];

var pkg = grunt.file.readJSON('package.json');

var lang = grunt.option('lang') || 'en';

grunt.initConfig({
	pkg : pkg,
	concat : {
		options : {
			process : function(src, filepath) {
				src = src.replace(/\$\{VERSION\}/g, pkg.version + ' (' + grunt.template.today('yyyy-mm-dd') + ')');
				src = src.replace(/\$\{THISYEAR\}/g, grunt.template.today('yyyy'));
				src = src.replace(/\/\*\*(\r\n|\n)[\s\S]*?\*\//g, '');
				src = src.replace(/(^|\s)\/\/.*$/mg, '');
				src = src.replace(/(\r\n|\n)\/\*\*\/.*(\r\n|\n)/g, '');
				src = src.replace(/[ \t]+$/mg, '');
				src = src.replace(/(\r\n|\n){2,}/g, '$1');
				return src;
			},
			stripBanners: true,
			banner: `
;(function (global, factory) {
	typeof exports !== 'undefined' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
		(global = global || self, global.KindEditor = factory());
}(this, function () {
`,
			footer: `
return KindEditor;
}));`
		},
		build : {
			src : SRC_FILES.concat('lang/' + lang + '.js').concat(PLUGIN_FILES),
			dest : 'publish/dist/kindeditor-all.js'
		}
	},
	uglify : {
		options : {
			banner : BANNER,
			footer : ''
		},
		build : {
			src : 'publish/dist/<%= pkg.filename %>-all.js',
			dest : 'publish/dist/<%= pkg.filename %>-all-min.js'
		}
	},
	compress : {
		main : {
			options: {
				archive: 'dist/<%= pkg.filename %>-<%= pkg.version %>-' + lang + '.zip',
			},
			files: [
				{src: ['attached'], dest: 'kindeditor/'},
				{src: ['lang/**'], dest: 'kindeditor/'},
				{src: ['plugins/**'], dest: 'kindeditor/'},
				{src: ['themes/**'], dest: 'kindeditor/'},
				{src: ['kindeditor*.js'], dest: 'kindeditor/'},
				{src: ['license.txt'], dest: 'kindeditor/'},
			]
		}
	},
	copy: {
		main: {
		  src: 'themes/**/*',
		  dest: 'publish/',
		  options: {
			// process: function (content, srcpath) {
			//   return content.replace(/[sad ]/g,"_");
			// },
		  },
		},
		plugins: {
			src: 'plugins/**/*',
		  	dest: 'publish/',
		},
		index: {
			src: 'index.js',
		  	dest: 'publish/',
		},
		pkg: {
			src: 'package.json',
		  	dest: 'publish/',
		},
		license: {
			src: 'license.txt',
		  	dest: 'publish/',
		},
		readme: {
			src: 'README.md',
		  	dest: 'publish/',
		}
	},
});

grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-compress');
grunt.loadNpmTasks('grunt-contrib-copy');


grunt.registerTask('build', ['concat', 'uglify', 'copy']);
grunt.registerTask('zip', ['build', 'compress']);


grunt.registerTask('default', 'build');


};
