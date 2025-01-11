// 检查是否有提示文本，如果没有，则设置默认
chrome.storage.sync.get(['promptText'], function(result) {
  if (!result.promptText) {
    chrome.storage.sync.set({promptText: '我是一名职业院校的教师，目前正在指导学生进行岗位实习，要求学生每周完成一篇周记，然后我需要针对周记内容进行批阅，将批阅意见反馈给学生，以下是一篇学生的周记内容，请针对周记内容，给学生一个反馈，50字左右，不要出现套话。'}, function() {
      window.close();
    });
  }
});

function confirmPromptText(){
  var promptText = document.getElementById("promptText").value;
  chrome.storage.sync.set({promptText: promptText}, function() {
    alert('保存成功！')
    setTimeout(() => {
      window.close();
    }, 100)
  });
}

function loadPromptText(){
  chrome.storage.sync.get(['promptText'], function(result) {
    document.getElementById("promptText").value = result.promptText;
  });
}

document.getElementById('confirmButton').addEventListener('click', function() {
  confirmPromptText();
});

document.getElementById('promptText').value = loadPromptText()
