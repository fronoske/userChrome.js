// ==UserScript==
// @name           CopyTitleURL.uc.js
// @namespace      http://fronoske.net/
// @description    コンテキストメニューでタブのタイトルやURLをコピーする
// @include        main
// @compatibility  Firefox 71+
// @author         fronoske
// @note           コンテキストメニューでタブのタイトルやURLをコピーする
// @version        2019/07/10 initial release
// @version        2020/06/16 71+
// ==/UserScript==

(function () {
  
  const clipboard = Cc['@mozilla.org/widget/clipboardhelper;1'].getService(Ci.nsIClipboardHelper);

  // 親メニューの登録
  const MENU_ITEM_ID = "fronoske_copyTitleURL";
  const MENU_ITEM_LABEL = "タブのタイトルやURLをコピーする";
  const MENU_ITEM_ACCESSKEY = "C";
  const $parentItem = document.createXULElement("menu");
  $parentItem.setAttribute("id", MENU_ITEM_ID);
  $parentItem.setAttribute("label", MENU_ITEM_LABEL);
  $parentItem.setAttribute("accesskey", MENU_ITEM_ACCESSKEY);

  /* タブメニューに出す場合
   const tabContext = gBrowser.tabContainer.contextMenu;
   挿入位置を指定する場合
   const $closeAllTabsRight = document.getElementById("context_copyTabURL");
   tabContext.insertBefore($parentItem, $closeAllTabsRight);
   */
  
  const $contentAreaContext =  document.getElementById("contentAreaContextMenu"); // ページのコンテキストメニュー
  $contentAreaContext.appendChild($parentItem); // メニューの最後に追加
  const $menupopup = document.createXULElement("menupopup"); // メニューポップアップ要素が必要 https://developer.mozilla.org/ja/docs/Mozilla/Tech/XUL/menupopup
  $parentItem.appendChild($menupopup);

  // サブメニュー
  function registerEvent($item) {
    $item.addEventListener('click',function(event) {
      const tab = gBrowser.selectedTab;
      const url = tab.linkedBrowser.currentURI.spec;
      const title = tab.getAttribute("label");
      const strFormat = {
        'P': `${title} - ${url}`,
        'N': `${title}\n${url}`,
        'M': `[${title.replace("\\[","\\[").replace("\\]","\\]")}](${url.replace("\\)","%29")})`,
        'J': `[${title}|${url}]`,
      };
      const key = $item.getAttribute("accesskey");
      clipboard.copyString( strFormat[key] || strFormat['P'] ); // もしアクセスキーが想定外なら Plain

      //選択文字列を得る
      /* console.dir(content);
      console.dir( BrowserUtils.getSelectionDetails(content).fullText );
       得られない。。。
       */
    });
  }

  const menuItems = [
    { id: "fronoske_copyTitle",             key: "T", label: "タイトル" },
    { id: "fronoske_copyURL",               key: "U", label: "URL" },
    { id: "fronoske_copyTitleURL_plain",    key: "P", label: "タイトル - URL" },
    { id: "fronoske_copyTitleURL_newline",  key: "N", label: "タイトル(改行)URL" },
    { id: "fronoske_copyTitleURL_markdown", key: "M", label: "[タイトル](URL) markdown形式" },
    { id: "fronoske_copyTitleURL_jira",     key: "J", label: "[タイトル|URL] JIRA形式"  },
    ];
  menuItems.forEach( (item) => {
    const $item = document.createXULElement("menuitem");
    $item.setAttribute("id", item.id);
    $item.setAttribute("label", item.label);
    $item.setAttribute("accesskey", item.key);
    $menupopup.appendChild($item);
    registerEvent($item);
  });
  
}());
