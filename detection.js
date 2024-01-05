document.body.style.backgroundColor = "green";

const target = document.querySelector('#header-toolbar-symbol-search > div');

// MutationObserverのインスタンスを作成
const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        // 変更された文字列を取得
        const newText = mutation.target.textContent;
        chrome.runtime.sendMessage({ command: "updateTabUrl", url: newText });

    });
});

// オブザーバーの設定
const config = { characterData: true, childList: true, subtree: true };

// 対象要素とオブザーバーの設定を渡して監視を開始
observer.observe(target, config);
