// メッセージを受信したら関数を実行
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.command === "doSomething") {
    console.log(message.command)
    // doSomething();
    startProcessing()
  }
});





let urls = [
  "https://jp.tradingview.com/chart/"
];

// 処理を開始する関数
// タブIDを保存する配列を宣言する
let tabId = [];
function startProcessing() {
  // 配列の要素ごとにクエリを実行する
  urls.forEach(function (url) {
    console.log(url, "  url");
    let regUrl = url + "*";
    chrome.tabs.query({ url: regUrl }, function (tabs) {
      if (tabs.length > 0) {
        let tab = tabs[0];
        console.log(tab);
        // タブIDを保存する
        for (let i = 0; i < urls.length; i++) {
          if (url === urls[i]) {
            tabId.push({ [url]: tab.id });
            console.log(tabId);
          }
        }
        // コンテンツスクリプトを挿入する
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            files: [
              url === "https://jp.tradingview.com/chart/"
                ? "./detection.js"
                : "",
            ],
          },
          function () {
            chrome.runtime.onMessage.addListener(handleMessage);
          }
        );
      }
    });
  });

  // コンテンツスクリプトからのメッセージを処理して株探のタブを開く
  function handleMessage(message, sender, sendResponse) {
    console.log(message, sender, sendResponse);

    // @@task@@@
    // リンクのURLを配列化
    let urls = ["https://kabutan.jp/stock/chart?code=__code__"]
    

    if (message.command === "updateTabUrl")
      // URLの配列を作る
      chrome.tabs.query({}, function (tabs) {
        // tabsはすべてのタブの配列
        console.log(tabs);
        // urlsにマッチするタブのidを取得する
        for (let tab of tabs) {
          // urlプロパティを取得する
          let url = tab.url;
          // urlsの各要素と比較する
          for (let u of urls) {
            let a = u;
            let DelStr = a.replace("__code__", "");
            console.log(DelStr);
            console.log(url.includes(DelStr) || url.match(DelStr))
            console.log(url.includes(DelStr),url.match(DelStr))
            // 部分的な一致や正規表現などを使って判定する
            if (url.includes(DelStr) || url.match(DelStr)) {
              // マッチしたらidを出力する
              console.log(tab);
              console.log(url);
              console.log(u);
              // 差分となる部分を置き換える
              let newStr = u.replace("__code__", message.url); // valをmessage.urlに置き換える
              // 結果を表示する
              console.log(newStr);
              // 配列からURLを取り出してタブに設定する
              chrome.tabs.update(tab.id, { url: newStr });
            }
          }
        }
      });
  }
}



chrome.tabs.query({ url: "https://jp.tradingview.com/" }, function (tabs) {
  if (tabs.length > 0) {
    let tab = tabs[0];
    tabId2 = tab.id;

    // Insert content script
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["./detection.js"],
    });
  }
});



// 拡張機能が有効かどうかが変更されたときのイベントリスナー
chrome.storage.onChanged.addListener(function (changes, areaName) {
  if (changes.isEnabled) {
    let isEnabled = changes.isEnabled.newValue;
    if (isEnabled) {
      console.log(isEnabled);
      startProcessing();
    }
  }
});
