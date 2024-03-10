import {
  log,
}                  from 'wechaty'

// 定义一个异步函数来调用您的 API
export async function callLocalAPI (): Promise<void> {
  try {
    // 使用 fetch 发起 GET 请求
    const response = await fetch('http://127.0.0.1:8000/v1/api/pick_list')
    // 确保响应是 OK 的
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`)
    }
    // 解析 JSON 响应体
    const result = await response.json()
    return result
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }
}
