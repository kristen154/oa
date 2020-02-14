const nodeObjs = {
  "item-1": {id: 'item-1', title: 'item-1', classes: "normal-item", width: "160", height: "40", top: '150', left: '250'},
  "item-2": {id: 'item-2', title: 'item-2', classes: "normal-item", width: "160", height: "40", top: '350', left: '150'},
  "item-3": {id: 'item-3', title: 'item-3', classes: "normal-item", width: "160", height: "40", top: '350', left: '650'},
  "item-4": {id: 'item-4', title: 'item-4', classes: "normal-item", width: "160", height: "40", top: '150', left: '150'},
  "item-5": {id: 'item-5', title: 'item-5', classes: "normal-item", width: "160", height: "40", top: '150', left: '450'},
  "item-6": {id: 'item-6', title: 'item-6', classes: "normal-item", width: "160", height: "40", top: '350', left: '350'},
  "item-7": {id: 'item-7', title: 'item-7', classes: "normal-item", width: "160", height: "40", top: '550', left: '150'},
  "item-8": {id: 'item-8', title: 'item-8', classes: "normal-item", width: "160", height: "40", top: '650', left: '350'},
  "item-9": {id: 'item-9', title: 'item-9', classes: "normal-item", width: "160", height: "40", top: '550', left: '650'},
};

const relationList = [
  {from:'item-4',to:'item-1'},
  {from:'item-5',to:'item-3'},
  {from:'item-6',to:'item-7'},
  {from:'item-8',to:'item-6'},
  {from:'item-9',to:'item-5'},
]
export default [
  {
    url: '/vue-element-admin/flow/nodeList',
    type: 'get',
    response: _ => {
      //const { id } = config.query
      return {
        code: 20000,
        data: nodeObjs
      }
    }
  },
  {
    url: '/vue-element-admin/flow/relationList',
    type: 'get',
    response: _ => {
      //const { id } = config.query
      return {
        code: 20000,
        data: relationList
      }
    }
  },
]
