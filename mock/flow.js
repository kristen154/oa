const nodeObjs = {
  "item-1": {id: 'item-1', flow_id: "1232", node_name: 'item-1', classes: "normal-item", node_type: "一般", width: "160", height: "40", y: '150', x: '250'},
  "item-2": {id: 'item-2', flow_id: "1232", node_name: 'item-2', classes: "normal-item", node_type: "一般", width: "160", height: "40", y: '350', x: '150'},
  "item-3": {id: 'item-3', flow_id: "1232", node_name: 'item-3', classes: "normal-item", node_type: "一般", width: "160", height: "40", y: '350', x: '650'},
  "item-4": {id: 'item-4', flow_id: "1232", node_name: 'item-4', classes: "normal-item", node_type: "一般", width: "160", height: "40", y: '150', x: '150'},
  "item-5": {id: 'item-5', flow_id: "1232", node_name: 'item-5', classes: "normal-item", node_type: "一般", width: "160", height: "40", y: '150', x: '450'},
  "item-6": {id: 'item-6', flow_id: "1232", node_name: 'item-6', classes: "normal-item", node_type: "一般", width: "160", height: "40", y: '350', x: '350'},
  "item-7": {id: 'item-7', flow_id: "1232", node_name: 'item-7', classes: "normal-item", node_type: "一般", width: "160", height: "40", y: '550', x: '150'},
  "item-8": {id: 'item-8', flow_id: "1232", node_name: 'item-8', classes: "normal-item", node_type: "一般", width: "160", height: "40", y: '650', x: '350'},
  "item-9": {id: 'item-9', flow_id: "1232", node_name: 'item-9', classes: "normal-item", node_type: "一般", width: "160", height: "40", y: '550', x: '650'},
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
