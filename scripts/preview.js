/**
 * 生成小程序预览二维码
 * 用法: npm run ci:preview
 * 环境变量:
 *   WECHAT_CI_KEY_PATH       - 私钥文件路径（必填）
 *   WECHAT_CI_PREVIEW_PATH   - 二维码输出路径，默认 ./preview_qrcode.png
 */
const ci = require('miniprogram-ci');
const path = require('path');

const APPID = 'wx3d94b6dae502cd63';
const PROJECT_PATH = path.resolve(__dirname, '..');

const keyPath = process.env.WECHAT_CI_KEY_PATH;
if (!keyPath) {
  console.error('错误: 请设置环境变量 WECHAT_CI_KEY_PATH 指向小程序私钥文件');
  process.exit(1);
}

const outputPath = process.env.WECHAT_CI_PREVIEW_PATH || './preview_qrcode.png';

async function preview() {
  const project = new ci.Project({
    appid: APPID,
    type: 'miniProgram',
    projectPath: PROJECT_PATH,
    privateKeyPath: path.resolve(PROJECT_PATH, keyPath),
    ignores: ['node_modules/**/*', 'scripts/**/*', '.github/**/*'],
  });

  console.log('生成预览二维码...');

  const result = await ci.preview({
    project,
    desc: 'Preview',
    setting: {
      es6: true,
      minified: true,
      minifyWXML: true,
    },
    qrcodeFormat: 'image',
    qrcodeOutputPath: outputPath,
    pagePath: 'pages/index/index',
    onProgressUpdate: (progress) => {
      console.log(`预览生成进度: ${progress}%`);
    },
  });

  console.log(`预览二维码已保存到: ${outputPath}`);
  console.log('用微信扫一扫此二维码可在开发者工具中预览');
}

preview().catch((err) => {
  console.error('预览失败:', err.message);
  process.exit(1);
});
