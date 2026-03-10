let noteContent = ''
let iframeDocument = null
let contentCheckInterval = null


function getRemark(text) {
	const remarkTextArea = iframeDocument.getElementById('recontent')
	const wordsCount = iframeDocument.getElementById('Journal_TCount')
	const passRadio = iframeDocument.querySelectorAll('[type="radio"]')[0]
	const bRadio = iframeDocument.querySelectorAll('[type="radio"]')[3]
	let eventSource = new EventSource('https://hewuhelper.hewuqi.tech/gpt/remark-helper?content=' + encodeURIComponent(text))

	// 默认设置为通过  级别为B
	passRadio.checked = true
	bRadio.checked = true

	eventSource.onmessage = function(event) {
		const json = JSON.parse(event.data)
		const text = json.output.text
		remarkTextArea.value = text

		wordsCount.value = text.length
	}

	// 监听特定的事件类型
	eventSource.addEventListener('customEvent', function(event) {
		console.log('Custom event:', event.data);
	})

	// 处理连接打开的事件
	eventSource.onopen = function(event) {
		console.log('Connection established');
	}

	// 处理连接错误
	eventSource.onerror = function(event) {
		console.error('Error occurred:', event);
		// 关闭连接，防止自动重连
    eventSource.close();
    console.log('Connection closed to prevent reconnection');
	}
}

const currentUrl = window.location.href

// 选择所有的链接
const links = document.querySelectorAll('a')
	// 为每个链接绑定点击事件监听器
	links.forEach(link => {
			link.addEventListener('click', function(event) {
			setTimeout(() => {
				const iframe = document.getElementById('layui-layer-iframe1')
				if (iframe) {
					// 清除之前的定时器
					if (contentCheckInterval) {
						clearInterval(contentCheckInterval);
					}
					iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
					let tdElement = iframeDocument.querySelectorAll('td[align="left"]')[2];
					// 如果找到了该 td 元素
					if (tdElement) {
						// 获取该 td 元素中的文本内容
						noteContent = tdElement.textContent.trim(); // 使用 textContent 获取文本并去除多余的空格
						chrome.storage.sync.get(['promptText'], function(result) {
							if (!result.promptText) {
								chrome.storage.sync.set({promptText: '我是一名职业院校的教师，目前正在指导学生进行岗位实习，要求学生每周完成一篇周记，然后我需要针对周记内容进行批阅，将批阅意见反馈给学生，以下是一篇学生的周记内容，请针对周记内容，给学生一个反馈，50字左右，不要出现套话。'}, function() {
									window.close();
								});
							} else {
								const promptText = result.promptText
								const text = promptText + "。学生周记内容如下：" + noteContent
								getRemark(text)
							}
						});

						// 设置定时器，每秒检查一次内容变化
						contentCheckInterval = setInterval(() => {
							iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
							tdElement = iframeDocument.querySelectorAll('td[align="left"]')[2];
							const newNoteContent = tdElement.textContent.trim();
							console.log('newNoteContent:', newNoteContent);
							if (newNoteContent !== noteContent) {
								noteContent = newNoteContent;
								chrome.storage.sync.get(['promptText'], function(result) {
									const promptText = result.promptText
									const text = promptText + "。学生周记内容如下：" + noteContent
									getRemark(text)
								});
							}
						}, 1000);
					} else {
						console.log('未找到目标 td 元素');
					}
				} else {
					// 如果 iframe 不存在，清除定时器
					if (contentCheckInterval) {
						clearInterval(contentCheckInterval);
					}
				}
			}, 1000)
			});
	});

