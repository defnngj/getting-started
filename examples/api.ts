interface ApiResponse {
  success: boolean;
  result: string;
}

export interface UserData {
  name: string;
  wechat_rename: string;
}

export interface TaskData {
  task: string;
  wechat_rename: string;
}

// 捡漏商品列表
export async function pickListAPI (): Promise<ApiResponse> {
  try {
    // 使用 fetch 发起 GET 请求
    const response = await fetch('http://127.0.0.1:8000/v1/api/pick_list')
    // 确保响应是 OK 的
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`)
    }
    // 解析 JSON 响应体
    const result: ApiResponse = await response.json() as ApiResponse
    return result
  } catch (error) {
    console.error('Failed to fetch data:', error)
    throw error
  }
}

export async function addUserAPI (user: UserData): Promise<ApiResponse> {
  try {
    // 使用 fetch 发起 POST 请求
    const response = await fetch('http://127.0.0.1:8000/v1/api/add_user', {
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    // 确保响应是 OK 的
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`)
    }

    // 解析 JSON 响应体，并使用类型断言
    const result = await response.json() as ApiResponse
    return result
  } catch (error) {
    console.error('Failed to post data:', error)
    throw error
  }
}

export async function addUserTaskAPI (user: TaskData): Promise<ApiResponse> {
  try {
    // 使用 fetch 发起 POST 请求
    const response = await fetch('http://127.0.0.1:8000/v1/api/add_user_task', {
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    // 确保响应是 OK 的
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`)
    }

    // 解析 JSON 响应体，并使用类型断言
    const result = await response.json() as ApiResponse
    return result
  } catch (error) {
    console.error('Failed to post data:', error)
    throw error
  }
}
