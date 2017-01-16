const utils = {}

utils.getImgId = (url) => {
	let arr = url.split('/');
	return arr[arr.length - 1].split('.')[0]
}

module.exports = utils;