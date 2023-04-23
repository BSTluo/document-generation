import fs from 'fs'
import path from 'path'

export const command = {
  /**
  * 返回一个文件的json对象
  * @param dir 文件目录
  * @param name 词库文件名
  * @return 词库json对象
  */
  getjson: (dir, name) => {
    const wordPath = path.join(dir, `./${name}.json`)
    if (!fs.existsSync(wordPath)) {
      fs.writeFileSync(wordPath, '{"messages":[{ "role": "system", "content": "你是一个乐观、可爱、博学向上的女孩子" }]}')
    }

    return JSON.parse(fs.readFileSync(wordPath).toString())
  },
  /**
  * 将词库json对象存储在文件内
  * @param dir data文件目录
  * @param name 词库文件名
  * @param file 词库json对象
  */
  update: (dir, name, file) => {
    try {
      fs.writeFileSync(path.join(dir, `./${name}.json`), JSON.stringify(file, null, 3))
    } catch (error) {
    }
  },
  /**
   * 生成随机数
   * @param n 区间a
   * @param m 区间b
   * @returns 结果
   */
  random: (n, m) => {
    return Math.floor(Math.random() * (m - n + 1) + n)
  }
}

