/**
 * 检查路径是否为外部链接
 * @param {string} path - 要检查的路径
 * @returns {Boolean} - 如果是外部链接返回 true，否则返回 false
 */
export function isExternal(path) {
  // 使用正则表达式检查路径是否以 http:、https:、mailto: 或 tel: 开头
  return /^(https?:|mailto:|tel:)/.test(path)
}


/**
 * 验证是否是预定义的有效用户名数组
 * @param {string} str - 要验证的用户名字符串
 * @returns {Boolean} - 如果用户名有效返回 true，否则返回 false
 */
export function validUsername(str) {
  // 预定义的有效用户名数组
  const valid_map = ['admin', 'editor','user']

  // 检查传入的用户名（即参数str）是否在有效用户名数组中
  // 使用 trim() 移除字符串两端的空白字符
  // indexOf 方法如果找不到元素会返回 -1，找到了则返回元素的索引（非负数）
  return valid_map.indexOf(str.trim()) >= 0
}
