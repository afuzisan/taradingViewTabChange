let tabId1; // タブID1を格納する変数
let tabId2; // タブID2を格納する変数
let urls = ['https://jp.tradingview.com/chart/', 'https://www.kabudragon.com/s?t=','https://kabutan.jp/stock/chart?code='];


// 処理を停止する関数
function stopProcessing() {
  // Remove content scripts and listeners
  if (tabId1) {
    chrome.scripting.executeScript({
      target: { tabId: tabId1 },
    });
    tabId1 = null;
  }
  if (tabId2) {
    chrome.scripting.executeScript({
      target: { tabId: tabId2 },
    });
    tabId2 = null;
    chrome.tabs.reload(tabId2);
  }

}


// 処理を開始する関数
// タブIDを保存する配列を宣言する
let tabId = [];
function startProcessing() {
  // URLの配列を定義する
  // @task
  // urlsの所をそのサイトで表示されてるリンク一覧に変更->items.start[0]
 
  // 配列の要素ごとにクエリを実行する
  urls.forEach(function (url) {
    console.log(url,'  url')
    let regUrl = url + '*'
    chrome.tabs.query({ url: regUrl }, function (tabs) {
      console.log(url,tabs,tabs.length)
      if (tabs.length > 0) {
        let tab = tabs[0];
        // タブIDを保存する
        for (let i = 0; i < urls.length; i++) {
          if (url === urls[i]) {
            tabId[i] = tab.id;
            console.log(tabId[i])
          }
        }
        // コンテンツスクリプトを挿入する
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          // @task
          // https://jp.tradingview.com/chart/*の部分を、ok_urlに変更
          files: [url === 'https://jp.tradingview.com/chart/' ? './detection.js' : '']
        }, function () {
          // urlsの配列に含まれるURLのうち、kabudragonを含むものを変数に代入する 
          let kabudragonUrl = urls.find(url => url.includes('kabudragon'));
          console.log(kabudragonUrl)

          // 変数を使ってクエリを実行する 
          if (url === kabudragonUrl) { chrome.runtime.onMessage.addListener(handleMessage); }
          // コンテンツスクリプトからのメッセージを処理する
          if (url === 'https://www.kabudragon.com/s?t') {
            chrome.runtime.onMessage.addListener(handleMessage);
          }
        });
      }
    });
  });







  // コンテンツスクリプトからのメッセージを処理して株探のタブを開く
  function handleMessage(message, sender, sendResponse) {
    console.log(message)
    if (message.command === "updateTabUrl") {
      let kabudragonUrl = urls.find(url => url.includes('kabudragon'));
      console.log(kabudragonUrl)

      regKabudragonUrl = kabudragonUrl +'*'
      chrome.tabs.query({ url: regKabudragonUrl }, function (tabs) {
        console.log(tabs)
        if (tabs.length > 0) {
          let tab = tabs[0];
          console.log(tab)
          chrome.tabs.update(tab.id, { url: 'https://www.kabudragon.com/s?t=' + message.url });
        }
      });
    }
  }


  chrome.tabs.query({ url: 'https://jp.tradingview.com/' }, function (tabs) {
    if (tabs.length > 0) {
      let tab = tabs[0];
      tabId2 = tab.id;

      // Insert content script
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['./detection.js']
      });
    }
  });



  // タブが削除されたときのイベントリスナー
  chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
    if (tabId === tabId2) {
      chrome.storage.sync.set({ isEnabled: false });
    }
  });

  // タブが更新されたときのイベントリスナー
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tabId === tabId2 && changeInfo.status === 'complete') {
      chrome.storage.sync.set({ isEnabled: false });
    }
  });
}


// 拡張機能が有効かどうかが変更されたときのイベントリスナー
chrome.storage.onChanged.addListener(function (changes, areaName) {
  if (changes.isEnabled) {
    let isEnabled = changes.isEnabled.newValue;
    if (isEnabled) {
      console.log(isEnabled)
      startProcessing();
    } else {
      stopProcessing();
    }
  }
});




