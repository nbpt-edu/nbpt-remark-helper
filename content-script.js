const observer = new MutationObserver((mutationsList, observer) => {
	for (let mutation of mutationsList) {
		if (mutation.type === 'childList') {
			setTimeout(() => {
				const iframe = document.getElementById('layui-layer-iframe1')
				if (iframe) {
					const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
					const tdElement = iframeDocument.querySelectorAll('td[align="left"]')[1];
					// 如果找到了该 td 元素
					if (tdElement) {
						// 获取该 td 元素中的文本内容
						const textContent = tdElement.textContent.trim(); // 使用 textContent 获取文本并去除多余的空格
						console.log('周记内容：', textContent);
					} else {
						console.log('未找到目标 td 元素');
					}
				}
			}, 2000)
		}
	  }
})

function init() {
}

init()

// 配置观察选项
const config = { childList: true, subtree: true };
// 开始观察页面的 body 元素
observer.observe(document.body, config);
