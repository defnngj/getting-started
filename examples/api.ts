interface ApiResponse {
  success: boolean;
  result: string;
}

interface ApiTaskResponse {
  success: boolean;
  result: {
    [key: string]: string;
  };
}

export interface UserData {
  name: string;
  wechat_rename: string;
}

export interface TaskData {
  task: string;
  task_name: string;
  wechat_rename: string;
}

export interface OpinionData {
  opinion: string;
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

// 蹲号任务列表
export async function getDoneTaskAPI (): Promise<ApiTaskResponse> {
  try {
    // 使用 fetch 发起 GET 请求
    const response = await fetch('http://127.0.0.1:8000/v1/api/get_done_task')
    // 确保响应是 OK 的
    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`)
    }
    // 解析 JSON 响应体
    const result: ApiTaskResponse = await response.json() as ApiTaskResponse
    return result
  } catch (error) {
    console.error('Failed to fetch data:', error)
    throw error
  }
}

// 删除我的蹲号任务
export async function delUserTaskAPI (task: TaskData): Promise<ApiResponse> {
  try {
    // 使用 fetch 发起 POST 请求
    const response = await fetch('http://127.0.0.1:8000/v1/api/delete_user_task', {
      body: JSON.stringify(task),
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

// 我的蹲号任务列表
export async function getMeTaskListAPI (task: TaskData): Promise<ApiResponse> {
  try {
    // 使用 fetch 发起 GET 请求
    const response = await fetch(`http://127.0.0.1:8000/v1/api/get_user_task_list?wechat_rename=${task.wechat_rename}`)
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

// 我的顿号任务详情
export async function getMeTasDetailsAPI (task: TaskData): Promise<ApiResponse> {
  try {
    // 使用 fetch 发起 GET 请求
    const response = await fetch(`http://127.0.0.1:8000/v1/api/get_user_task_detail?wechat_rename=${task.wechat_rename}&task_name=${task.task_name}`)
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

// 添加意见
export async function addOpinionAPI (opinion: OpinionData): Promise<ApiResponse> {
  try {
    // 使用 fetch 发起 POST 请求
    const response = await fetch('http://127.0.0.1:8000/v1/api/add_user_opinion', {
      body: JSON.stringify(opinion),
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
