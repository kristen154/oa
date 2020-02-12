import request from '@/utils/request'

export function fetchNodeList(query) {
  return request({
    url: '/vue-element-admin/gridlayout/nodelist',
    method: 'get',
    params: query
  })
}
