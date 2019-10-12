// ==UserScript==
// @name           HistorySidebarOpenInTab.uc.js
// @namespace      http://fronoske.net/
// @description    Open new Tab from History Sidebar
// @include        main
// @include        chrome://browser/content/history/history-panel.xul
// @include        chrome://browser/content/places/historySidebar.xul
// @compatibility  Firefox 66+
// @author         fronoske
// @note           履歴サイドバーから新しいタブで開く
// @version        2019/05/29 initial release
// ==/UserScript==


// 独自イベントクラス
class MouseEventWithCtrl extends MouseEvent {
  // オリジナルのイベントオブジェクトを受けて独自のイベントを生成する
  constructor(ev) {
    const mouseEventInit = {
      screenX: ev.screenX,
      screenY: ev.screenY,
      clientX: ev.clientX,
      clientY: ev.clientY,
      button : ev.button ,
      buttons: ev.buttons,
      region : ev.region ,
      relatedTarget: ev.target,
      detail: ev.detail,
      view: ev.view,
      sourceCapabilities: ev.sourceCapabilities,
      bubbles: ev.bubbles,
      cancelable: ev.cancelable,
      composed: ev.composed,
      ctrlKey: true, // for opening new tab
    };
    super(ev.type, mouseEventInit)
  }
}

/*****************************
 * 履歴サイドバー
 *****************************/
const historySidebarOpenInTab = {

  get _BTree() {
    return document.getElementById("historyTree");
  },

  init: function() {
    if (!this._BTree) return;

    console.log(`historySidebarOpenInTab.init() ${location.href}`);
    this.origOnclick = this._BTree.onclick; // オリジナルのイベントハンドラ
    this._BTree.onclick = this.onClick;
  },

  // サイドバーをunloadしたときに呼び出される用だが、必要ないので使ってない
  uninit: function() {
    console.log(`historySidebarOpenInTab.uninit() ${location.href}`);
    this._BTree.onclick = historySidebarOpenInTab.origOnclick;
  },

  // 新しい onclick イベントハンドラ
  onClick: function(origEv) {
    // オリジナルのイベントに似たイベント（ctrlKey=true）を生成
    // MouseEventオブジェクトだと target などが readonly なので新たに用意したMouseEventのサブクラスを使う
    const fakeEventWithCtrl = new MouseEventWithCtrl(origEv);
    Object.defineProperty(fakeEventWithCtrl, 'target', {writable: false, value: origEv.target});
    Object.defineProperty(fakeEventWithCtrl, 'originalTarget', {writable: false, value: origEv.originalTarget});
    // オリジナルの onclick を発動
    historySidebarOpenInTab.origOnclick(fakeEventWithCtrl); // 実体は PlacesUIUtils.onSidebarTreeClick(ev);
  },
};

/*****************************
 * メニューバー「履歴」
 *****************************/
const historyMenuOpenInTab = {
  init: function() {
    const func_source = `
      if(event.target.localName == "menuitem" && event.target.attributes.scheme){
        gBrowser.loadOneTab(event.target._placesNode.uri,
          {relatedToCurrent: true,inBackground: false, triggeringPrincipal: Services.scriptSecurityManager.createNullPrincipal({})}
      )
      }`;
    const historyMenu = document.getElementById("goPopup");
    if (historyMenu) historyMenu.setAttribute("oncommand", func_source);
  }
};

historySidebarOpenInTab.init();
historyMenuOpenInTab.init();
