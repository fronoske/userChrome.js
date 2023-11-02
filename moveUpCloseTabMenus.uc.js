// ==UserScript==
// @name           moveUpCloseTabMenus.uc.js
// @namespace      https://github.com/fronoske/
// @description    Move sub-menu items of "Close Multiple Tabs..." up
// @include        main
// @compatibility  Firefox 92+
// @author         fronoske
// @note           「複数のタブを閉じる」のサブメニューをメインメニューにする
// @version        2021/11/10 initial release

(function()
{
  let $menuItem_closeTabOptions = document.getElementById("context_closeTabOptions");
  let $menuPopup_closeTabOptions = document.getElementById("closeTabOptions");
  let $menuPopup_tabContextMenu = $menuItem_closeTabOptions.parentNode;
  let $childNodes = $menuPopup_closeTabOptions.childNodes;
  while($childNodes[0]){
    $menuPopup_tabContextMenu.insertBefore($childNodes[0], null);
  };
  $menuPopup_closeTabOptions.remove();
  $menuItem_closeTabOptions.remove();
})();
