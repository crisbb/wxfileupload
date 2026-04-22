/**
 * 上传小程序代码到微信后台（体验版）
 * 用法: npm run ci:upload
 * 环境变量:
 *   WECHAT_CI_KEY_PATH  - 私钥文件路径（必填）
 *   WECHAT_CI_VERSION   - 版本号，默认当天日期 YYYY.MM.DD
 *   WECHAT_CI_DESC      - 版本描述，默认 "Automated upload"
 */
const ci = require('miniprogram-ci');
const path = require('path');

const APPID = 'wx3d94b6dae502cd63';
const PROJECT_PATH = path.resolve(__dirname, '..');

const keyPath = process.env.WECHAT_CI_KEY_PATH;
if (!keyPath) {
  console.error('错误: 请设置环境变量 WECHAT_CI_KEY_PATH 指向小程序私钥文件');
  console.error('示例: WECHAT_CI_KEY_PATH=./private.key npm run ci:upload');
  process.exit(1);
}

const version = process.env.WECHAT_CI_VERSION || new Date().toISOString().slice(0, 10).replace(/-/g, '.');
const desc = process.env.WECHAT_CI_DESC || 'Automated upload';

async function upload() {
  const project = new ci.Project({
    appid: APPID,
    type: 'miniProgram',
    projectPath: PROJECT_PATH,
    privateKeyPath: path.resolve(PROJECT_PATH, keyPath),
    ignores: ['node_modules/**/*', 'scripts/**/*', '.github/**/*'],
  });

  console.log(`开始上传小程序 - 版本: ${version}, 描述: ${desc}`);

  const result = await ci.upload({
    project,
    version,
    desc,
    setting: {
      es6: true,
      minified: true,
      minifyWXML: true,
    },
    onProgressUpdate: (progress) => {
      console.log(`上传进度: ${progress}%`);
    },
  });

  console.log('上传成功!');
  console.log(`  版本: ${result.version}`);
  console.log(`  提交时间: ${new Date(result.commitTime * 1000).toLocaleString()}`);
}

upload().catch((err) => {
  console.error('上传失败:', err.message);
  process.exit(1);
});
