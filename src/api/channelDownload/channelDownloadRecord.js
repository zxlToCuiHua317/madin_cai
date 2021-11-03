import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/channelDownloadRecord',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/channelDownloadRecord/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/channelDownloadRecord',
    method: 'put',
    data
  })
}

export function getGameCode() {
  return request({
    url: '/api/gamePackageInfo/queryGameCodeList',
    method: 'get'
  })
}

export default { add, edit, del, getGameCode }
