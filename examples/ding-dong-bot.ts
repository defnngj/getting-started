#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
/**
 * Wechaty - Conversational RPA SDK for Chatbot Makers.
 *  - https://github.com/wechaty/wechaty
 */
// https://stackoverflow.com/a/42817956/1123955
// https://github.com/motdotla/dotenv/issues/89#issuecomment-587753552
import 'dotenv/config.js'

import {
  Contact,
  Message,
  ScanStatus,
  WechatyBuilder,
  log,
  Friendship,
}                  from 'wechaty'
import { pickListAPI, addUserAPI, UserData, addUserTaskAPI, TaskData, getDoneTaskAPI } from './api.ts'

import qrcodeTerminal from 'qrcode-terminal'

import { nanoid } from 'nanoid'

let interval: NodeJS.Timer| undefined

// 给所有联系人&群发送捡漏消息
async function sendMessageToAll () {
  const contactList = await bot.Contact.findAll()
  const roomList = await bot.Room.findAll()

  try {
    // 捡漏任务
    const resp = await pickListAPI()
    const { success: pickListSuccess, result: pickListResult }  = resp

    if (pickListSuccess) {
      // 给用户发消息
      for (const contact of contactList) {
        if (contact.type() === bot.Contact.Type.Individual) {
          await contact.say(pickListResult)
        }
      }
      // 给群发消息
      for (const room of roomList) {
        await room.say(pickListResult)
      }
    }

    // 蹲号任务
    const task = await getDoneTaskAPI()
    const { success: taskSuccess, result: taskResult } = task

    if (taskSuccess) {
      for (const contact of contactList) {
        const alias = await contact.alias()
        if (alias !== undefined) {
          const content = taskResult[alias]
          if (content !== undefined) {
            // 发给蹲号任务
            await contact.say(content)
          }
        }
      }

    }
  } catch (err) {
    console.error(err)
  }
}

function onScan (qrcode: string, status: ScanStatus) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    const qrcodeImageUrl = [
      'https://wechaty.js.org/qrcode/',
      encodeURIComponent(qrcode),
    ].join('')
    log.info('StarterBot', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)

    qrcodeTerminal.generate(qrcode, { small: true })  // show qrcode on console

  } else {
    log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
  }
}

function onLogin (user: Contact) {
  log.info('StarterBot', '%s login', user)
  log.info('开启定时任务！！')
  // 确保定时器只被设置一次
  if (!interval) {
    interval = setInterval(() => {
      // 使用立即执行的异步函数来调用 sendMessageToAll
      void (async () => {
        try {
          await sendMessageToAll()
        } catch (error) {
          console.error(error)
        }
      })()
    }, 60 * 60 * 1000) // 设置为每小时执行一次
  }
}

function onLogout (user: Contact) {
  log.info('StarterBot', '%s logout', user)
}

async function onFriendship (friendship: Friendship) {
  let logMsg

  try {
    logMsg = 'received `friend` event from ' + friendship.contact().name()
    log.info(logMsg)

    switch (friendship.type()) {
      /**
       *
       * New Friend Request
       *
       * when request is set, we can get verify message from `request.hello`,
       * and accept this request by `request.accept()`
       */
      case bot.Friendship.Type.Receive:
        logMsg = 'accepted automatically'
        log.info('before accept')
        await friendship.accept()

        // if want to send msg , you need to delay sometimes
        await new Promise((r) => setTimeout(r, 1000))
        await friendship.contact().say(`${friendship.contact().name()} 你好, 我是剑三小舞!`)
        log.info('after accept')
        break

      default:
        break
    }
  } catch (e) {
    console.error(e)
    logMsg = 'Friendship try catch failed'
  }

  log.info(logMsg)
}

async function checkUserTask (str: string): Promise<boolean> {
  return str.startsWith('蹲号') && str.length > 10
}

async function checkUserTaskDetail (str: string): Promise<boolean> {
  return str.includes('规则名称：') && str.includes('规则：')  && str.includes('体型：') && str.includes('门派：') && str.includes('价格：')
}

async function onMessage (msg: Message) {
  log.info('StarterBot', msg.toString())

  if (msg.text() === '蹲号') {
    // 创建别名逻辑
    const contact = msg.talker()
    const name = contact.name()
    const alias = await contact.alias()
    log.info(`联系人昵称: ${name} , 微信别名： ${alias}`)

    const noid = nanoid()
    const newAlias = `friend_${noid}`
    let wechatRename = alias || newAlias
    if (!alias) {
      log.info('没别名')
      await contact.alias(newAlias)
      wechatRename = newAlias
    }

    const newUser: UserData = {
      name,
      wechat_rename: wechatRename,
    }
    await addUserAPI(newUser)
    await contact.say('回复下面内容模版（不包含本行）：\n蹲号\n规则名称：一狐丝成女\n规则：金陵凤 金发·璨月蝶心 曼纱旋舞\n体型：成女\n门派：七秀 万花\n价格：5000')
    return
  }

  // 顿号规则任务
  const isTask = await checkUserTask(msg.text())
  if (isTask) {

    const isMap = await checkUserTaskDetail(msg.text())
    if (!isMap) {
      await msg.say('蹲号规则配置错误')
      return
    }

    const contact = msg.talker()
    const name = contact.name()
    const alias = await contact.alias()
    log.info(`联系人昵称: ${name} , 微信别名： ${alias}`)

    const newTask: TaskData = {
      task: msg.text(),
      wechat_rename: alias || '',
    }
    const resp  = await addUserTaskAPI(newTask)
    const { success, result } = resp

    if (success) {
      await contact.say('蹲号成功')
    } else {
      await contact.say(result)
    }
    return
  }

  // 测试ding~dong：
  if (msg.text() === 'ding') {
    await msg.say('dong')
  }
}

const bot = WechatyBuilder.build({
  name: 'ding-dong-bot',
  /**
   * You can specific `puppet` and `puppetOptions` here with hard coding:
   *
  puppet: 'wechaty-puppet-wechat',
  puppetOptions: {
    uos: true,
  },
   */
  /**
   * How to set Wechaty Puppet Provider:
   *
   *  1. Specify a `puppet` option when instantiating Wechaty. (like `{ puppet: 'wechaty-puppet-whatsapp' }`, see below)
   *  1. Set the `WECHATY_PUPPET` environment variable to the puppet NPM module name. (like `wechaty-puppet-whatsapp`)
   *
   * You can use the following providers locally:
   *  - wechaty-puppet-wechat (web protocol, no token required)
   *  - wechaty-puppet-whatsapp (web protocol, no token required)
   *  - wechaty-puppet-padlocal (pad protocol, token required)
   *  - etc. see: <https://wechaty.js.org/docs/puppet-providers/>
   */
  // puppet: 'wechaty-puppet-whatsapp'

  /**
   * You can use wechaty puppet provider 'wechaty-puppet-service'
   *   which can connect to remote Wechaty Puppet Services
   *   for using more powerful protocol.
   * Learn more about services (and TOKEN) from https://wechaty.js.org/docs/puppet-services/
   */
  // puppet: 'wechaty-puppet-service'
  // puppetOptions: {
  //   token: 'xxx',
  // }
})

bot.on('scan',    onScan)
bot.on('login',   onLogin)
bot.on('logout',  onLogout)
bot.on('message', onMessage)
bot.on('friendship', onFriendship)

bot.start()
  .then(() => log.info('StarterBot', 'Starter Bot Started.'))
  .catch(e => log.error('StarterBot', e))
