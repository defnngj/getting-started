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
}                  from 'wechaty'
import { callLocalAPI } from './api.ts'

import qrcodeTerminal from 'qrcode-terminal'

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
}

function onLogout (user: Contact) {
  log.info('StarterBot', '%s logout', user)
}

// 给所有联系人发送捡漏消息
async function sendMessageToAll () {
  const contactList = await bot.Contact.findAll()

  try {
    const resp = await callLocalAPI()
    const { success, result } = resp || {}

    if (success) {
      for (const contact of contactList) {
        await contact.say(result)
      }
    }
  } catch (err) {
    console.error(err)
  }
}

let interval: NodeJS.Timer

async function onMessage (msg: Message) {
  log.info('StarterBot', msg.toString())
  // 定时任务 5分钟触发一次
  if (!interval) {
    interval = setInterval(sendMessageToAll, 5 * 60 * 1000)
  }
  // const contactList = await bot.Contact.findAll()
  // const roomList = await bot.Room.findAll()

  // // log.info('Bot', 'on(message) skip non-text message: %s', contact)
  // // await contact.say('你好，这是一条自动发送的消息！')
  // await sleep(5000)
  // try {
  //   // 获取捡漏消息
  //   const resp = await callLocalAPI()
  //   const success = resp?.success
  //   const result = resp?.result

  //   if (success === true) {
  //     for (const contact of contactList) {
  //       log.info('个人', contact)
  //       await contact.say(result)
  //     }
  //     // for (const room of roomList) {
  //     //   log.info('群', room)
  //     //   // await contact.say('你好，这是一条自动发送的消息！')
  //     // }
  //     // console.log(`当前用户加入的群组总数：${rooms.length}`);
  //   }
  // } catch (error) {
  //   console.error('Error calling API:', error)
  //   return
  // }

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

bot.start()
  .then(() => log.info('StarterBot', 'Starter Bot Started.'))
  .catch(e => log.error('StarterBot', e))
