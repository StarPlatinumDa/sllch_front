/**
 * APP端图片压缩
 *  参数说明：
 *  img 图片url
 *  scale缩放比例 1-100
 *  callback 回调设置返回值 
*/
export function translateapp(img, scale, callback) {
		plus.io.resolveLocalFileSystemURL(img, (entry) => { //通过URL参数获取目录对象或文件对象
			entry.file((file) => { // 可通过entry对象操作图片 
				console.log('压缩前图片信息:' + JSON.stringify(file)); //压缩前图片信息
				if (file.size > 504800) { //   如果大于500Kb进行压缩
					plus.zip.compressImage({ // 5+ plus.zip.compressImage 了解一下，有详细的示例
						src: img, //src: 压缩原始图片的路径    
						dst: img.replace('.png', 'yasuo.png').replace('.PNG',
								'yasuo.PNG').replace('.jpg', 'yasuo.jpg')
							.replace('.JPG', 'yasuo.JPG'),
						width: '40%', //dst: (String 类型 )压缩转换目标图片的路径，这里先在后面原始名后面加一个yasuo区分一下
						height: '40%', //width,height: (String 类型 )缩放图片的宽度,高度
						quality: scale, //quality: (Number 类型 )压缩图片的质量
						overwrite: true, //overwrite: (Boolean 类型 )覆盖生成新文件
						// format:'jpg'   //format: (String 类型 )压缩转换后的图片格式
					}, (event) => {
						console.log('压缩后图片信息:' + JSON.stringify(event)); 
						//返回压缩后的图片路径
						callback(event);
					}, function(err) {
						 console.log('Resolve file URL failed: ' + err.message);
					});
				} else { //else小于500kb跳过压缩，直接返回现有的src
					callback(img);
					
				}
			});
		}, (e) => { // 返回错误信息
			 console.log('Resolve file URL failed: ' + e.message);
		});
	
}
// base转Blob
export function base64ToBlob(base64) { 
	var arr = base64.split(','),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], {
		type: mime
	});
}
 
 