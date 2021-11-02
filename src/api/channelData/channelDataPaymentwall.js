import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/channelDataPaymentwall',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/channelDataPaymentwall/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/channelDataPaymentwall',
    method: 'put',
    data
  })
}
export function sortData(data) {
  return request({
    url: 'api/channelDataPaymentwall',
    method: 'get',
    params: {
      page: data.page,
      size: data.size,
      sort: data.sort
    }
  })
}

export default { add, edit, del, sortData }
