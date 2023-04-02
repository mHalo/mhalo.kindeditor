/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2022 kindeditor.net
*
* @author Roddy <luolonghao@gmail.com>
* @site http://kindeditor.net/
* @licence http://kindeditor.net/license.php
*******************************************************************************/

KindEditor.plugin('symbols', function (K) {
    var self = this, name = 'symbols',
        symbols = {
            teshu: "、,。,·,ˉ,ˇ,¨,〃,—,～,‖,…,‘,’,“,”,〝,〞,〓,〔,〕,〈,〉,「,」,『,』,〖,〗,∶,∧,∨,∪,∩,∈,∷,⊥,∥,∠,⌒,⊙,∵,∴,♂,♀,°,′,″,℃,＄,¤,￠,￡,‰,§,№,☆,★,○,●,◎,◇,◆,□,■,△,▲,※,→,←,↑,↓,〡,〢,〣,〤,〥,〦,〧,〨,〩,㊣,㎎,㎏,㎜,㎝,㎞,㎡,㏄,㏎,㏑,㏒,㏕,︰,￢,￤,℡,ˊ,ˋ,˙,–,―,‥,‵,℅,℉,↖,↗,↘,↙,∕,∟,∣,≒,☉,⊕,〒",
            shuxue:"＋,－,×,·,÷,／,±,㏒,㏑,∑,∏,×,√,﹢,﹣,±,∫,∮,∝,∞,∧,∨,＝,≈,≡,≠,＜,＞,≤,≥,≦,≧,≮,≯,º,¹,²,³,½,¾,¼,％,‰",
            xuhao: "⒈,⒉,⒊,⒋,⒌,⒍,⒎,⒏,⒐,⒑,⒒,⒓,⒔,⒕,⒖,⒗,⒘,⒙,⒚,⒛,⑴,⑵,⑶,⑷,⑸,⑹,⑺,⑻,⑼,⑽,⑾,⑿,⒀,⒁,⒂,⒃,⒄,⒅,⒆,⒇,①,②,③,④,⑤,⑥,⑦,⑧,⑨,⑩,㈠,㈡,㈢,㈣,㈤,㈥,㈦,㈧,㈨,㈩,ⅰ,ⅱ,ⅲ,ⅳ,ⅴ,ⅵ,ⅶ,ⅷ,ⅸ,ⅹ,Ⅰ,Ⅱ,Ⅲ,Ⅳ,Ⅴ,Ⅵ,Ⅶ,Ⅷ,Ⅸ,Ⅹ,Ⅺ,Ⅻ,❶,❷,❸,❹,❺,❻,❼,❽,❾,❿,㈠,㈡,㈢,㈣,㈤,㈥,㈦,㈧,㈨,㈩",
            lading: "Α,Β,Γ,Δ,Ε,Ζ,Η,Θ,Ι,Κ,Λ,Μ,Ν,Ξ,Ο,Π,Ρ,Σ,Τ,Υ,Φ,Χ,Ψ,Ω,α,β,γ,δ,ε,ζ,η,θ,ι,κ,λ,μ,ν,ξ,ο,π,ρ,σ,τ,υ,φ,χ,ψ,ω",
            zhuyin: "ā,á,ǎ,à,ō,ó,ǒ,ò,ē,é,ě,è,ī,í,ǐ,ì,ū,ú,ǔ,ù,ǖ,ǘ,ǚ,ǜ,ü",
            yinbiao: "i:,i,e,æ,ʌ,ə:,ə,u:,u,ɔ:,ɔ,a:,ei,ai,ɔi,əu,au,iə,εə,uə,p,t,k,b,d,g,f,s,ʃ,θ,h,v,z,ʒ,ð,tʃ,tr,ts,dʒ,dr,dz,m,n,ŋ,l,r,w,j,",
            rwzf: "ぁ,あ,ぃ,い,ぅ,う,ぇ,え,ぉ,お,か,が,き,ぎ,く,ぐ,け,げ,こ,ご,さ,ざ,し,じ,す,ず,せ,ぜ,そ,ぞ,た,だ,ち,ぢ,っ,つ,づ,て,で,と,ど,な,に,ぬ,ね,の,は,ば,ぱ,ひ,び,ぴ,ふ,ぶ,ぷ,へ,べ,ぺ,ほ,ぼ,ぽ,ま,み,む,め,も,ゃ,や,ゅ,ゆ,ょ,よ,ら,り,る,れ,ろ,ゎ,わ,ゐ,ゑ,を,ん,ァ,ア,ィ,イ,ゥ,ウ,ェ,エ,ォ,オ,カ,ガ,キ,ギ,ク,グ,ケ,ゲ,コ,ゴ,サ,ザ,シ,ジ,ス,ズ,セ,ゼ,ソ,ゾ,タ,ダ,チ,ヂ,ッ,ツ,ヅ,テ,デ,ト,ド,ナ,ニ,ヌ,ネ,ノ,ハ,バ,パ,ヒ,ビ,ピ,フ,ブ,プ,ヘ,ベ,ペ,ホ,ボ,ポ,マ,ミ,ム,メ,モ,ャ,ヤ,ュ,ユ,ョ,ヨ,ラ,リ,ル,レ,ロ,ヮ,ワ,ヰ,ヱ,ヲ,ン,ヴ,ヵ,ヶ",
            ewzf: "А,Б,В,Г,Д,Е,Ё,Ж,З,И,Й,К,Л,М,Н,О,П,Р,С,Т,У,Ф,Х,Ц,Ч,Ш,Щ,Ъ,Ы,Ь,Э,Ю,Я,а,б,в,г,д,е,ё,ж,з,и,й,к,л,м,н,о,п,р,с,т,у,ф,х,ц,ч,ш,щ,ъ,ы,ь,э,ю,я",
            zhibiao: "┏,┳,┓,╔,╦,╗,╓,╥,╖,┣,╋,┫,╠,╬,╣,╟,╫,╢,┗,┻,┛,╚,╩,╝,╙,╨,╜,┌,┬,┐,╭,╮,╱,╲,┃,║,├,┼,┤,╰,╯,╲,╱,┆,┇,└,┴,┘,━,═,┅,┈,╳,⊿,▁,▂,▃,▄,▅,▆,▇,█,▉,▊,▋,▌,▍,▎,▏,▓,▔,▕,▼,▽,◢,◣,◤,◥",
            qita: "✐,✎,✏,✑,✒,✁,✂,✃,✄,✆,✉,☎,☏,☑,☒,☯,☰,☲,☱,☴,☵,☶,☳,☷,❄,☃,♨,웃,유,❖,☽,☾,☪,✿,❀,⚘,♔,♕,♖,♗,♘,♙,♚,♛,♜,♝,♞,♟,▧,▨,❣,✚,✪,✣,✤,✥,✦,❉,❥,❦,❧,❃,❂,❁,❀,✄,☪,☣,☢,☠,☭,☇,☈,⊙,☊,☋,☌,☍,▣,▤,▥,▦,▩,◘,◙,◈,♫,♬,♪,♩,♭,♪,✄,☪,☣,☢,☠,♯,♩,♪,♫,♬,♭,♮,☎,☏,☪",
        },
        page = {
            cols: 9,
            total: Object.keys(symbols),
            current: 'teshu',
            tags: {
                teshu: '特殊',
                shuxue: '数学',
                xuhao: '序号',
                lading: '拉丁',
                zhuyin: '注音',
                yinbiao: '音标',
                rwzf: '日文字符',
                ewzf: '俄文字符',
                zhibiao: '制表符',
                qita: '其他'
            }
        };
	if(self.symbolConfig && self.symbolConfig instanceof Function){
		self.symbolConfig.call(null, symbols, page);
	}
    self.clickToolbar(name, function () {
        var elements = [];
        var wrapperDiv = K('<div class="ke-plugin-symbol"></div>'),
            menu = self.createMenu({
                name: name,
                beforeRemove: function () {
                    removeEvent();
                }
            });
		var iconLeft = K(".ke-toolbar .ke-icon-symbols").pos().x;
		var iconWidth = K(".ke-toolbar .ke-icon-symbols").width();
		var winWidth = K(document.body).width();
        menu.div.append(wrapperDiv);

        function bindCellEvent(cell, symbol) {
            cell.mouseover(function () {
                K(this).addClass('ke-on');
            });
            cell.mouseout(function () {
                K(this).removeClass('ke-on');
            });
            cell.click(function (e) {
                self.insertHtml(symbol).hideMenu();
                setTimeout(function(){
                    self.focus(); 
                    self.cmd.select();
                    self.cmd.selection(true);
                }, 1e2);
                e.stop();
            });
        }
        function symbolTable(key, parent) {
            var tableDom = document.createElement('ul');
            parent.append(tableDom);
            tableDom.className = 'ke-ul';
            var thisSymbol = symbols[key].split(',');
            // tableDom.cellPadding = 0;
            // tableDom.cellSpacing = 0;
            // tableDom.border = 0;
            var rows = Math.ceil(thisSymbol.length / page.cols);
            var symbol;
            for (var i = 0; i < rows; i++) {
                var row = document.createElement('li');
                K(row).addClass('ke-li');
                K(tableDom).append(row)
                for (var j = 0; j < page.cols; j++) {
                    symbol = thisSymbol[(page.cols * i) + j];
                    if (symbol === undefined) {
                        continue;
                    }
                    var span = K('<span class="ke-symbol">' + symbol + '</span>');
                    bindCellEvent(span, symbol);
                    K(row).append(span);
                    elements.push(span);
                }
            }
            return tableDom;
        }
        var table = symbolTable(page.current, wrapperDiv), pageDiv;
		var tableWidth = K(wrapperDiv).width();
		if((iconLeft + tableWidth) > winWidth){
			K(menu.div).css({
				left: iconLeft - (tableWidth - iconWidth) + 'px'
			})
		}
        function removeEvent() {
            K.each(elements, function () {
                this.unbind();
            });
        }
        function bindPageEvent(el, key) {
            el.click(function (e) {
                removeEvent();
                table.parentNode.removeChild(table);
                pageDiv.remove();
                table = symbolTable(key, wrapperDiv);
                createPageTable(key);
                page.current = key;
                e.stop();
            });
        }
        function createPageTable(tagname) {
            pageDiv = K('<div class="ke-page"></div>');
            wrapperDiv.append(pageDiv);
            for (var key in page.tags) {
                var keyname = page.tags[key];
                if (key !== tagname) {
                    var tag = K('<span class="ke-page-item"><a href="javascript:;">[' + keyname + ']</a></span>');
                    bindPageEvent(tag, key);
                    pageDiv.append(tag);
                    elements.push(tag);
                } else {
                    pageDiv.append(K('<span class="ke-page-item ke-page-active">[' + keyname + ']</span>'));
                }
            }
        }
        createPageTable(page.current);
		// console.info(K,menu.div)
    });
});