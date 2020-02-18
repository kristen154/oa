/**
 * 整个文件夹导入
 */
export function requireDir(files, entryFile = ['./index.js']) {
  let list = []
  files.keys().forEach(key => {
    if (entryFile.includes(entryFile)) return
    // 必须是export default
    if (files(key).default) {
      list = list.concat(files(key).default)
    }
  })
  return list
}
