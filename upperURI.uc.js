// ==UserScript==
// @name           upperURI.uc.js
// @namespace      http://fronoske.net/
// @description    Add upper URIs to the context menu in Location bar.
// @include        main
// @compatibility  Firefox 66+
// @author         fronoske
// @note           ロケーションバーを右クリックでURLの階層を上がる
// @version        2019/05/08 57+
// @version        2007/08/05 initial release

(function()
{
  const attrName = "item-type";
  const attrValue = "upper-uri-menuitem";
  const urlBarId = "urlbar-container"
  
  // ポップアップ消去時に URIs とセパレータを削除
  document.getElementById(urlBarId).addEventListener("popuphidden", function(event)
  {
    const menupopup = event.originalTarget;
    const items = menupopup.getElementsByAttribute(attrName, attrValue);
    while(items.length){
      menupopup.removeChild(items[0]);
    }
  }, false);

  // ポップアップ表示時に URIs を調査、メニュー項目を生成
  document.getElementById(urlBarId).addEventListener("popupshowing", function(event)
  {
    const menupopup = event.originalTarget;
    const items = menupopup.getElementsByAttribute(attrName, attrValue);
    const uriArray = getUpURIs();
    if (items.length == 0 && uriArray.length > 0){
      const goUp = function(event)
      {
        if (event.type == "click" && event.button != 1) return;
        const targetURI = event.originalTarget.getAttribute("label");
        gBrowser.loadURI(targetURI, {triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal()});
        menupopup.hidePopup();
      };
      // セパレータ
      const sep = document.createElement("menuseparator");
      sep.setAttribute(attrName, attrValue);
      menupopup.insertBefore(sep, menupopup.firstChild);
      // URIs
      for(let i=0; i < uriArray.length; i++){
        const menuitem = document.createElement("menuitem");
        menuitem.id = attrValue + i;
        menuitem.setAttribute("label", uriArray[i]);
        menuitem.setAttribute(attrName, attrValue);
        menuitem.addEventListener("command", goUp, false);
        menuitem.addEventListener("click",   goUp, false);
        menupopup.insertBefore(menuitem, sep);
      }
    }
  }, false);

  const getUpURIs = function()
  {
    const uri = gBrowser.currentURI;
    const uriPath = uri.filePath;
    const pathArray = uriPath.split("/").filter( (e) => e != "" );
    const uriArray = pathArray.map( (e, idx) => uri.prePath + "/" + pathArray.slice(0, idx).join("/") );
    return uriArray.reverse();
  };
})();
