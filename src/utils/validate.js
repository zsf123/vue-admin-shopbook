/**
 * Created by jiachenpan on 16/11/18.
 */

// 判断是否是有效的用户名
export function isvalidUsername(str) {
  const valid_map = ['zsf','admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

// 判断是否是外链
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
