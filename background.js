// メッセージを受信したら関数を実行
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.command === "doSomething") {
    console.log(message.command)
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
    let regUrl = url + "*";
    chrome.tabs.query({ url: regUrl }, function (tabs) {
      if (tabs.length > 0) {
        let tab = tabs[0];
        // タブIDを保存する
        for (let i = 0; i < urls.length; i++) {
          if (url === urls[i]) {
            tabId.push({ [url]: tab.id });
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
    let urls = 
    [
      "https://kabutan.jp/stock/chart?code=__code__",
      "https://kabutan.jp/stock/news?code=__code__",
      "https://kabutan.jp/stock/finance?code=__code__",
      "https://kabutan.jp/stock/?code=__code__",
      "https://kabutan.jp/stock/kabuka?code=__code__",
      "https://kabutan.jp/stock/holder?code=__code__"
    ]
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

            // 部分的な一致や正規表現などを使って判定する
            if (url.includes(DelStr) || url.match(DelStr)) {
              // マッチしたらidを出力する

              // 差分となる部分を置き換える
              let newStr = u.replace("__code__", message.url); // valをmessage.urlに置き換える
              // 結果を表示する

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
