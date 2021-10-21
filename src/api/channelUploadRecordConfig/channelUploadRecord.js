import request from '@/utils/request'
export function add(data) {
  console.log(data)
  return request({
    url: '/api/channelUploadRecord',
    method: 'post',
    data
  })
}

export default { add }
