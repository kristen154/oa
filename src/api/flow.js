import request from '@/utils/request'

export function fetchNodeList(query) {
  return request({
    url: '/vue-element-admin/flow/nodeList',
    method: 'get',
    params: query
  })
}

export function fetchRelationList(query) {
  return request({
    url: '/vue-element-admin/flow/relationList',
    method: 'get',
    params: query
  })
}