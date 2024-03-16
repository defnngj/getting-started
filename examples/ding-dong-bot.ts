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
import { callLocalAPI } from './api.ts'

import qrcodeTerminal from 'qrcode-terminal'

let interval: NodeJS.Timer| undefined

// 给所有联系人&群发送捡漏消息
async function sendMessageToAll () {
  const contactList = await bot.Contact.findAll()
  const roomList = await bot.Room.findAll()

  try {
    const resp = await callLocalAPI()
    const { success, result } = resp || {}

    if (success) {
      // 给用户发消息
      for (const contact of contactList) {
        if (contact.type() === bot.Contact.Type.Individual) {
          await contact.say(result)
        }
      }
      // 给群发消息
      for (const room of roomList) {
        await room.say(result)
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

async function onMessage (msg: Message) {
  log.info('StarterBot', msg.toString())

  // 测试ding~dong：
  if (msg.text() === 'ding') {
    await msg.say('dong')
  }
  // 蹲号模板（暂未开放）：
  if (msg.text() === '蹲号') {
    await msg.say('蹲号模版(暂未开放):\n 条件1：\n 条件2：\n 条件3：\n')
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
