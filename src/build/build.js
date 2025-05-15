
import version from '../../package.json' assert {type: 'json'};
console.log('build > 文件开始执行！')

// 运行buld 打包指令后自动生成版本文件夹
import * as fs from 'fs';
import path from 'path';

function getRootPath(...dir) {
  return path.resolve(process.cwd(), ...dir)
}

const runBuild = async () => {
  try {
    const OUTPUT_DIR = 'dist'
    const VERSION = 'version.json'
    const versionJson = {
      version: `${version.version}`
    }
    fs.writeFileSync(getRootPath(`${OUTPUT_DIR}/${VERSION}`), JSON.stringify(versionJson))
    console.log(`version file is build successfully!`)
  } catch (error) {
    console.error('version build error:\n' + error)
    process.exit(1)
  }
}

runBuild()
console.log('build > 文件执行结束！')