import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/channelDataPaypal',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/channelDataPaypal/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/channelDataPaypal',
    method: 'put',
    data
  })
}
export function sortData(data) {
  return request({
    url: 'api/channelDataPaypal',
    method: 'get',
    params: {
      page: data.page,
      size: data.size,
      sort: data.sort
    }
  })
}

export default { add, edit, del, sortData }
