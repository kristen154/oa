//获取文件夹仲的路由模块

const routersFiles = require.context('.', false, /\.js$/)
let routerList = []
routersFiles.keys().forEach(key => {
  if(key==='./index.js') return
  routerList.push(routersFiles(key).default) //读取文件仲的default模块
})

export default routerList;
