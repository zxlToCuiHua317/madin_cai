import request from '@/utils/request'

export function add(data) {
  return request({
    url: 'api/channelDataPayermax',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'api/channelDataPayermax/',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: 'api/channelDataPayermax',
    method: 'put',
    data
  })
}

export function sortData(data) {
  return request({
    url: 'api/channelDataPayermax',
    method: 'get',
    params: {
      page: data.page,
      size: data.size,
      sort: data.sort,
      ...data
    }
  })
}

export default { add, edit, del, sortData }
