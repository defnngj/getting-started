# Wechaty Getting Started

* 设置环境变量

```bash
export WECHATY_LOG=verbose
export WECHATY_PUPPET=wechaty-puppet-padlocal  #local pad 登录
```

* 注册试用token
http://pad-local.com/ 注册个账号， 获得一个7天试用Token

```bash
export WECHATY_PUPPET_PADLOCAL_TOKEN=puppet_padlocal_e8044daf883c4523aa754d4ca9cc7997
```

* 启动项目

```bash
npm install # 安装依赖
npm start  # 启动，出现二维码，手机扫码登录
```
