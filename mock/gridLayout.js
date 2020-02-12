const itemList = [
    {"x":0,"y":0,"w":2,"h":1,"i":"0","node": {'nodeName':'input','label':'你好'}},
    {"x":2,"y":0,"w":2,"h":1,"i":"1","node": {'nodeName':'textarea',label:'文本框'}},
    {"x":4,"y":0,"w":2,"h":1,"i":"2","node": {'nodeName':'number',label:'数字'}},
    {"x":6,"y":0,"w":2,"h":1,"i":"3","node": {'nodeName':'SELECT',label:'选择框',options:[{value:"选项1",label:"选项1"},{value:"选项2",label:"选项2"}]}},
    {"x":8,"y":0,"w":2,"h":1,"i":"4","node": {'nodeName':'dateTime','label':'日期事件'}},
    {"x":10,"y":0,"w":2,"h":1,"i":"5","node": {'nodeName':'date','label':'日期'}},
];

export default [
  {
    url: '/vue-element-admin/gridlayout/nodelist',
    type: 'get',
    response: _ => {
      //const { id } = config.query
      return {
        code: 20000,
        data: itemList
      }
    }
  },
]
