# 项目文档：登陆界面

## 项目概述

本项目是一个登陆界面，提供账号和密码的输入框以及登陆按钮，实现用户登陆验证功能。

## 项目结构

- host：127.0.0.1
- port：8080

### 登陆界面

该页面包含以下元素：

- 账号输入框
  - api：false
- 密码输入框
  - api：false
- 登陆按钮
  - api：true
  - func：验证前端输入的账号密码是否正确
  - howTo：按下登陆按钮后，js获取账号和密码输入框内的信息，并确认没有非法符号发送给后端。后端收到前端传入登陆信息后，与数据库内存储的信息对比，是否正确，正确则返回 true，错误则返回 false。
  - route：http://127.0.0.1:8080/login

## API 接口设计

### POST /login

验证用户输入的账号和密码是否正确，并返回验证结果。

请求数据：

```
{
  "username": "string",
  "password": "string"
}
```

响应数据：

```
{
  "success": "boolean"
}
```

## 技术栈

- 前端：HTML、CSS、JavaScript
- 后端：Python Flask
- 数据库：MySQL