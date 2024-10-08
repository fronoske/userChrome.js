// ==UserScript==
// @name           upperURI.uc.js
// @namespace      http://github.com/fronoske/
// @description    Add upper URIs to the context menu in Location bar.
// @include        main
// @compatibility  Firefox 111+
// @author         fronoske
// @note           ロケーションバーを右クリックでURLの階層を上がる
// @version        2024/08/23 bugfix
// @version        2023/11/02 111+
// @version        2019/05/08 57+
// @version        2007/08/05 initial release

(function()
{
  const attrName = "item-type";
  const attrValue = "upper-uri-menuitem";
  const urlBarId = "urlbar-container"
  
  // ポップアップ消去時に URIs とセパレータを削除
  console.log(document.getElementById(urlBarId));
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
        // gBrowser.loadURI(targetURI, {triggeringPrincipal: Services.scriptSecurityManager.getSystemPrincipal()});
        openLinkIn(targetURI, "current", {allowThirdPartyFixup:false,
         postData:null,
         referrerInfo: null,
         triggeringPrincipal:Services.scriptSecurityManager.createNullPrincipal({})
        });
        menupopup.hidePopup();
      };
      // セパレータ
      const sep = document.createXULElement("menuseparator");
      sep.setAttribute(attrName, attrValue);
      menupopup.insertBefore(sep, menupopup.firstChild);
      // URIs
      for(let i=0; i < uriArray.length; i++){
        const menuitem = document.createXULElement("menuitem");
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
    const uriRef = uri.ref; // no use
    const uriQuery = uri.query;
    const pathArray = uriPath.split("/").filter( (e) => e != "" );
    const paramArray = uriQuery.split("&");
    let uriArray = pathArray.map( (e, idx) => uri.prePath + "/" + pathArray.slice(0, idx).join("/") );
    if ( paramArray.length > 0 ){
      uriArray.push(uri.prePath + uri.filePath);
      for(let idx=1; idx < paramArray.length; idx++){
        uriArray.push(uri.prePath + uri.filePath + "?" + paramArray.slice(0, idx).join("&"));
      }
    }
    return uriArray.reverse();
  };
})();
