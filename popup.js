// ボタンを取得
var btn = document.getElementById("btn");
console.log(btn)
// ボタンがクリックされたらメッセージを送信
btn.addEventListener("click", function() {
  console.log(btn)

  chrome.runtime.sendMessage({command: "doSomething"});
});
