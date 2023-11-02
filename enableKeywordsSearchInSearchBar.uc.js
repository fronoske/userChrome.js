// ==UserScript==
// @name           enableKeywordsSearchInSearchBar.uc.js
// @namespace      http://github.com/fronoske/
// @description    Enable Keywords Search In SearchBar
// @include        main
// @compatibility  Firefox 119+
// @author         fronoske
// @note           Keywords Searchを検索バーから行えるようにする
// @note           alice0775 さんの以下のスクリプトを改修
// @note           https://github.com/alice0775/userChrome.js/blob/master/enableKeywordsSearchInSearchBar_Fx31.uc.js
// @note           conqueryModoki2には非対応
// @note           その他、履歴や注意は上記の元スクリプトを参照
// @version        2023/11/02 Firefox 119+
// @version        2019/05/16 Firefox 66+
// ==/UserScript==

function log(aMsg){
  Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService).logStringMessage(aMsg);
}

(function(){
  const searchBar = document.getElementById("searchbar");
  if (!searchBar){
    log("No search bar!");
    return;
  }
  searchBar.doSearch__keyworks = searchBar.doSearch;
  searchBar.doSearch = async function doSearch(aData, aWhere, aEngine) {
    const data = await UrlbarUtils.getShortcutOrURIAndPostData(aData);
    if (data.url && data.url != aData) {
      //remove keyword
      const offset = aData.indexOf(" ");
      const textBox = this._textbox;
      textBox.value = aData.substr(offset + 1);
      //do keyword search
      if (/^javascript:/.test(data.url)) aWhere = "current";
      if ("TreeStyleTabService" in window) TreeStyleTabService.onBeforeBrowserSearch(textBox.value);
      openLinkIn(data.url, aWhere, {inBackground: false, triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal()});
      if ("TreeStyleTabService" in window) TreeStyleTabService.stopToOpenChildTab();
    } else {
      this.doSearch__keyworks(aData, aWhere, aEngine);
    }
  };
})();
