let noteContent = ''
let iframeDocument = null


function getRemark(params) {
	fetch("https://hewuhelper.hewuqi.tech/gpt/remark-helper", {
		method: "POST", // 请求方法
		headers: {
			"Content-Type": "application/json" // 设置请求头
		},
		body: JSON.stringify(params) // 请求体，转换为 JSON 字符串
	})
	.then(response => response.text())
	.then(data => {
		const startIndex = data.lastIndexOf("data:")
		const endIndex = data.lastIndexOf("}")

		const content = data.substring(startIndex + 5, endIndex + 1)
		const json = JSON.parse(content)
		const text = json.output.text
		const remarkTextArea = iframeDocument.getElementById('recontent')
		remarkTextArea.value = text
	})
	.catch(error => {
		console.error("Error:", error); // 处理错误
	});
}

// 选择所有的链接
const links = document.querySelectorAll('a');

// 为每个链接绑定点击事件监听器
links.forEach(link => {
    link.addEventListener('click', function(event) {
		setTimeout(() => {
			const iframe = document.getElementById('layui-layer-iframe1')
			if (iframe) {
				iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
				const tdElement = iframeDocument.querySelectorAll('td[align="left"]')[1];
				// 如果找到了该 td 元素
				if (tdElement) {
					// 获取该 td 元素中的文本内容
					noteContent = tdElement.textContent.trim(); // 使用 textContent 获取文本并去除多余的空格
					const params = {
						msgs: [
							{
								"isMine": true,
								"text": "我是一名职业院校的教师，目前正在指导学生进行岗位实习，要求学生每周完成一篇周记，然后我需要针对周记内容进行批阅，将批阅意见反馈给学生，以下是一篇学生的周记内容，请针对周记内容，给学生一个反馈，50字左右。周记内容如下：" + noteContent
							}
						]
					}
					getRemark(params)
				} else {
					console.log('未找到目标 td 元素');
				}
			}
		}, 1000)
    });
});
