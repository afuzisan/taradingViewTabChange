document.body.style.backgroundColor = "green";


// 対象となる要素を選択
// @task
// クロームストレージからのselectorに変更
const target = document.querySelector('#header-toolbar-symbol-search > div');

// MutationObserverのインスタンスを作成
const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        // 変更された文字列を取得
        const newText = mutation.target.textContent;
        console.log(newText);

        // バックグラウンドページにメッセージを送信
        chrome.runtime.sendMessage({ command: "updateTabUrl", url: newText });

        // 新しいMutationObserverの作成
        // const newObserver = new MutationObserver((mutations, observer) => {
        //     // 変更が検知されたときの処理
        //     console.log('新しいMutationObserverによって変更が検知されました');

        //     mutations.forEach(mutation => {
        //         const textareaNode = document.querySelector('body > div.js-rootresizer__contents.layout-with-border-radius > div.layout__area--right > div > div.widgetbar-pages > div.widgetbar-pagescontent > div.widgetbar-page.active > div.widget-X9EuSe_t.widgetbar-widget.widgetbar-widget-detail > div.widgetbar-widgetbody > div > div:nth-child(2) > form > span > span.inner-slot-W53jtLjw.inner-middle-slot-W53jtLjw > textarea')
        //         console.log(textareaNode.textContent)
        //     });
        // });

        // const NoteTarget = document.querySelector('body > div.js-rootresizer__contents.layout-with-border-radius > div.layout__area--right > div > div.widgetbar-pages > div.widgetbar-pagescontent > div.widgetbar-page.active > div.widget-X9EuSe_t.widgetbar-widget.widgetbar-widget-detail');

        // // 新しいMutationObserverによる監視の開始
        // newObserver.observe(NoteTarget, { characterData: true, childList: true, subtree: true });

    });
});

// オブザーバーの設定
const config = { characterData: true, childList: true, subtree: true };

// 対象要素とオブザーバーの設定を渡して監視を開始
observer.observe(target, config);

