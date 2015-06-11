# BigBite

Bookmarklet. Ctrl+drag &amp; Ctrl+C.
You can copy multi selected &lt;td&gt;, all together.

### What is

FirefoxではCtrl+ドラッグ（クリック）で&lt;table&gt;タグの任意のセルだけを選択してコピーできます。

その機能をGoogle Chromeでも使えるようにすることを目的としたブックマークレットです。

able to use the selection operation of Firefox in Google Chrome.

### Usage

Latest bookmarklet code is provided from [this site](http://www.usamimi.info/~uyuta/big-bite.html)

    1. Open the web page in Google Chrome, and execute BigBite
    2. Click(or drag) the cell while pushing the Ctrl key
    3. Press Ctrl+C, and copy it
    4. Paste it somewhere

#### Notes

フレーム分割されたページについては、2階層だけ動作します。
ネストを深くするとイベントハンドラの割り当てが多くなりすぎるのではないかと判断したためです。

今後は、Google Chromeだけでなく、その他のメジャーブラウザへの対応を検討しております。
バグ・不具合等は是非お気軽にご報告ください。
