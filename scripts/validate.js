/**
 * 校验小程序代码（不上传，仅检查合规性）
 * 用法: npm run ci:validate
 * 环境变量:
 *   WECHAT_CI_KEY_PATH - 私钥文件路径（必填）
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

async function validate() {
  const project = new ci.Project({
    appid: APPID,
    type: 'miniProgram',
    projectPath: PROJECT_PATH,
    privateKeyPath: path.resolve(PROJECT_PATH, keyPath),
    ignores: ['node_modules/**/*', 'scripts/**/*', '.github/**/*'],
  });

  console.log('开始校验小程序代码...');

  const result = await ci.checkCodeQuality(project);

  console.log('校验完成!');
  if (result && result.errCode === 0) {
    console.log('代码校验通过，没有发现问题');
  } else if (result) {
    console.log(`校验发现 ${result.warningCount || 0} 个警告, ${result.errorCount || 0} 个错误`);
    if (result.warnings) {
      result.warnings.forEach((w) => console.log(`  ⚠ ${w}`));
    }
    if (result.errors) {
      result.errors.forEach((e) => console.log(`  ✘ ${e}`));
    }
  }
}

validate().catch((err) => {
  console.error('校验失败:', err.message);
  process.exit(1);
});
