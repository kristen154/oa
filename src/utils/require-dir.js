/**
 * 整个文件夹导入
 */
export function requireDir(files, entryFile = './index.js') {
  const list = []
  files.keys().forEach(key => {
    console.log(key)
    if (key === entryFile) return
    list.push(files(key).default)
  })
  return list
}
