// ==UserScript==
// @name           HistorySidebarOpenInTab.uc.js
// @namespace      http://github.com/fronoske/
// @description    Open new Tab from History Sidebar
// @include        main
// @include        chrome://browser/content/history/history-panel.xhtml
// @include        chrome://browser/content/history/history-panel.xul
// @include        chrome://browser/content/places/historySidebar.xhtml
// @include        chrome://browser/content/places/historySidebar.xul
// @compatibility  Firefox 144+
// @author         fronoske
// @note           履歴サイドバーから新しいタブで開く
// @version        2019/05/29 initial release
// @version        2020/06/16 73+
// @version        2025/12/16 144+
// ==/UserScript==

/*****************************
 * 履歴サイドバー
 *****************************/
const historySidebarOpenInTab = {
    get _BTree() {
        return document.getElementById("historyTree");
    },

    init: function () {
        if (!this._BTree) return;

        console.log(`historySidebarOpenInTab.init() ${location.href}`);
        // addEventListener を使用してクリックイベントをキャプチャフェーズで捕捉
        this._BTree.addEventListener("click", this.onClick, true);
    },

    // サイドバーをunloadしたときに呼び出される用
    uninit: function () {
        console.log(`historySidebarOpenInTab.uninit() ${location.href}`);
        this._BTree.removeEventListener("click", this.onClick, true);
    },

    // 新しい onclick イベントハンドラ
    onClick: function (ev) {
        // 左クリックのみ処理
        if (ev.button !== 0) return;

        const tree = historySidebarOpenInTab._BTree;

        // クリック位置から行を取得
        const row = tree.getRowAt(ev.clientX, ev.clientY);
        if (row < 0) return; // 有効な行がない場合

        // 選択されたノードを取得
        const node = tree.view.nodeForTreeIndex(row);

        // コンテナ（フォルダ）ではなくURIを持つ項目の場合のみ処理
        if (node && node.uri && !PlacesUtils.nodeIsContainer(node)) {
            ev.preventDefault();
            ev.stopPropagation();

            // 親ウィンドウのgBrowserを使って新しいタブで開く
            const mainWindow = window.top;
            const newTab = mainWindow.gBrowser.addTab(node.uri, {
                triggeringPrincipal: Services.scriptSecurityManager.createNullPrincipal({}),
            });
            // 新しいタブをフォアグラウンドで表示
            mainWindow.gBrowser.selectedTab = newTab;
        }
    },
};

/*****************************
 * メニューバー「履歴」
 *****************************/
const historyMenuOpenInTab = {
    init: function () {
        const func_source = `
      if(event.target.localName == "menuitem" && event.target.attributes.scheme){
        const newTab = gBrowser.addTab(event.target._placesNode.uri,
          {triggeringPrincipal: Services.scriptSecurityManager.createNullPrincipal({})}
        );
        gBrowser.selectedTab = newTab;
      }`;
        const historyMenu = document.getElementById("goPopup");
        if (historyMenu) historyMenu.setAttribute("oncommand", func_source);
    },
};

historySidebarOpenInTab.init();
historyMenuOpenInTab.init();
