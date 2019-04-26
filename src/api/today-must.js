import api from '@/utils/api'

// 查询今日待办事项
export function getTodayMustList(state) {
  return api({
    url: 'todayMust/get',
    method: 'get',
    params: state
  })
}

export function getTodayMust(id) {
  return api({
    url: 'todayMust/getinfo',
    method: 'get',
    params: id
  })
}

// 删除今日必达事项
export function batchDeleteTodayMust(todaysMustList) {
  return api({
    url: 'todayMust/delete',
    method: 'post',
    data: todaysMustList
  })
}

// 保存事项
export function saveTodayMust(todayMust) {
  return api({
    url: 'todayMust/save',
    method: 'post',
    data: todayMust
  })
}
