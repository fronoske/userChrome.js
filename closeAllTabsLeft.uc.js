// ==UserScript==
// @name           closeAllTabsLeft.uc.js
// @namespace      http://fronoske.net/
// @description    Add menu item for "Close All Tabs left" into tab context menu
// @include        main
// @compatibility  Firefox 66+
// @author         fronoske
// @note           ロケーションバーを右クリックでURLの階層を上がる
// @version        2019/05/08 initial release

(function()
{
  const MENU_ITEM_ID = "context_closeTabsToTheHead";
  const MENU_ITEM_LABEL = "左側のタブをすべて閉じる";
  const MENU_ITEM_ACCESSKEY = "L";
  
  const item = document.createElement("menuitem");
  item.setAttribute("id", MENU_ITEM_ID);
  item.setAttribute("label", MENU_ITEM_LABEL);
  item.setAttribute("accesskey", MENU_ITEM_ACCESSKEY);

  const tabContext = gBrowser.tabContainer.contextMenu;
  const $closeAllTabsRight = document.getElementById("context_closeTabsToTheEnd");
  tabContext.insertBefore(item, $closeAllTabsRight);

  item.addEventListener('click',function(event) {
    const selectedTab = gBrowser.selectedTab;
    // HTMLCollection はそのままだと some を使えないので Array に変換
    const tabs = Array.prototype.slice.call(gBrowser.tabs);
    // some を使うことで条件に合ったらそこでループを終了する
    tabs.some( t => {
      if ( t == selectedTab ){
        return true;
      } else {
        gBrowser.removeTab(t);
      }
    });
  },false);

})();
