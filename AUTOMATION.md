# 微信小程序自动化发布指南

## 前置准备

1. 登录 [微信公众平台](https://mp.weixin.qq.com/) → 开发 → 开发管理 → 开发设置
2. 在"小程序代码上传"区域下载上传密钥，保存为 `private.key`
3. 将私钥文件放在项目根目录

## 本地使用

```bash
# 安装依赖
npm install

# 校验代码（不上传）
WECHAT_CI_KEY_PATH=./private.key npm run ci:validate

# 生成预览二维码
WECHAT_CI_KEY_PATH=./private.key npm run ci:preview

# 上传到体验版
WECHAT_CI_KEY_PATH=./private.key npm run ci:upload

# 指定版本号和描述
WECHAT_CI_KEY_PATH=./private.key \
WECHAT_CI_VERSION=1.0.1 \
WECHAT_CI_DESC="修复登录问题" \
npm run ci:upload
```

## GitHub Actions 自动发布

1. 在仓库 Settings → Secrets and variables → Actions 中添加 Secret：
   - `WECHAT_CI_KEY`：将 `private.key` 文件内容粘贴进去

2. 推送代码到 `main` 或 `master` 分支即可自动触发上传
3. 也可在 Actions 页面手动触发（workflow_dispatch）

## 命令说明

| 命令 | 说明 |
|------|------|
| `npm run ci:validate` | 代码校验，检查合规问题 |
| `npm run ci:preview` | 生成预览二维码，扫码可在手机上预览 |
| `npm run ci:upload` | 上传代码到微信后台，可在体验版中查看 |

## 环境变量

| 变量 | 必填 | 说明 |
|------|------|------|
| `WECHAT_CI_KEY_PATH` | 是 | 私钥文件相对路径 |
| `WECHAT_CI_VERSION` | 否 | 版本号，默认当天日期 |
| `WECHAT_CI_DESC` | 否 | 版本描述 |
| `WECHAT_CI_PREVIEW_PATH` | 否 | 预览二维码输出路径 |
