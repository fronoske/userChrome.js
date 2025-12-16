# userChrome.js

自作のUserChrome.js用スクリプトを置いています。
Firefox 147.0 で動作確認済み。

### スクリプト一覧

##### CopyTabURL.uc.js
ページ右クリックでタイトルとURLをコピーする。文字列の書式を選べる。ユーザー自身でのカスタマイズも簡単なはず。

##### HistorySidebarOpenInTab.uc.js
履歴サイドバーから新規タブで開く。ブックマークは about:config で設定できるのに履歴はないのはなぜ？

##### closeAllTabsLeft.uc.js
> [!NOTE]
> Fx78 でメニューに追加されたので今は不要

アクティブタブの左のタブをすべて閉じる。「右をすべて閉じる」はあるのに左がない。拡張機能があったけど日本語対応してないので自作。

##### moveUpCloseTabMenus.uc.js
タブコンテキストメニューの「複数のタブを閉じる」のサブメニューをすべてメインメニューにする。

#### upperURI.uc.js
ロケーションバー右クリックで現在のURIの上の階層に移動する。

alice0775 さんのリポジトリにも採用されているが、そちらはメニュー階層があるのでお好みに合わせてどうぞ。


### 超重要サイト

##### [userChrome.js用スクリプト - wiki@nothing](http://wiki.nothing.sh/page/userChrome.js%CD%D1%A5%B9%A5%AF%A5%EA%A5%D7%A5%C8)
各バージョンでの対応状況などの最新情報はここで。
> [!NOTE]
> 2023.10.23 現在、コンテンツが見えない。


#### [alice0775/userChrome.js](https://github.com/alice0775/userChrome.js)
ご存じalice0775さんのリポジトリ。本当にお世話になってます。

#### Firefox ソースリポジトリ

https://hg.mozilla.org/releases/comm-release/file

OpenLinkIn() などの関数の仕様を調べたりする。ちなみに OpenLinkIn() は /suite/base/content/utilityOverlay.js にある。
