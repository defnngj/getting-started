# Wechaty Getting Started

* node 版本

```bash
nvm use v18.18.0
```

* 设置环境变量

```bash
export WECHATY_LOG=verbose
export WECHATY_PUPPET=wechaty-puppet-padlocal  #local pad 登录
```

* 注册试用token
http://pad-local.com/ 注册个账号， 获得一个7天试用Token

```bash
export WECHATY_PUPPET_PADLOCAL_TOKEN=puppet_padlocal_5d75101eed104e1d971fe36a12c48fee
```

* 启动项目

```bash
npm install # 安装依赖
npm start  # 启动，出现二维码，手机扫码登录
```

* 提交代码

```bash
git push --no-verify origin main
```

`--no-verify` 忽略检查

* pm2 启动项目

```bash
pm2 start npm -- start
```
