
// popup.js
let checkbox = document.getElementById('isEnabled');
let currentUrl = "1514";



chrome.storage.sync.get('isEnabled', function (data) {
  // https://kabutan.jp/stock/*のタブがないときは、チェックボックスを無効にする
  chrome.tabs.query({ url: 'https://www.kabudragon.com/s?t=*' }, function (tabs) {
    if (tabs.length === 0) {
      checkbox.checked = false;
    }
    // それ以外のときは、チェックボックスの状態をそれ以前の状態にする
    else {
      checkbox.checked = data.isEnabled;
    }
  });
});

checkbox.addEventListener('change', function (event) {
  chrome.tabs.query({ url: 'https://jp.tradingview.com/chart/*' }, function (tabs) {
    if (tabs.length > 0) {
      chrome.tabs.query({ url: 'https://www.kabudragon.com/s?t=*' }, function (tabs) {
        if (tabs.length === 0) {
          chrome.tabs.create({ url: 'https://www.kabudragon.com/s?t=' + currentUrl, active: false }, function (tab) {
            chrome.storage.sync.set({ isEnabled: true });
            // 表示中のページのDOMを取得
            const target = document.querySelector('#header-toolbar-symbol-search > div');
            // 文字列を取得
            const newText = target.textContent;
            // バックグラウンドページにメッセージを送信
            chrome.runtime.sendMessage({ command: "updateTabUrl", url: newText });
            checkbox.checked = false;
          });
          
        } else {
          chrome.storage.sync.set({ isEnabled: event.target.checked });
        }
      });
    } else {
      checkbox.checked = false;
    }
  });
});


