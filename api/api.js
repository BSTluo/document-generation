import fs from 'fs'
import path from 'path'
import inquirer from 'inquirer';

/**
 * 工具函数包
 */
export const command = {
  /**
  * 读取一个文件的json对象
  * @param dir 从哪个文件夹读
  * @param name 读取的文件名
  * @return 读到的json对象
  */
  getjson: (dir, name) => {
    const wordPath = path.join(dir, `./${name}.json`)
    if (!fs.existsSync(wordPath)) {
      fs.writeFileSync(wordPath, '{"messages":[{ "role": "system", "content": "你是一个乐观、可爱、博学向上的女孩子" }]}')
    }

    return JSON.parse(fs.readFileSync(wordPath).toString())
  },
  /**
  * 将json对象存储在文件内
  * @param dir 存在哪个文件夹
  * @param name 存储的文件名
  * @param file json对象
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

/**
 * 命令行工具包
 */
export const ask = {
  /**
 * 从终端询问一个问题，返回答案
 * @param {问题} questions(String) 
 * @returns String:答案 
 */
  answer: async (questions) => {
    const obj = [
      {
        type: "input",
        message: questions,
        name: "occupation"
      }
    ]
    let test = await inquirer.prompt(obj)
    return test.occupation
  },

  /**
  * 从终端询问一个问题，它不填写答案的时候带有默认值
  * @param {问题} questions(String)
  * @param {答案} defValue(String)
  * @returns String|默认值:答案
  */
  answerDefault: async (questions, defValue) => {
    const obj = [
      {
        type: "input",
        message: questions,
        name: "occupation",
        default: defValue
      }
    ]
    let test = await inquirer.prompt(obj)
    return test.occupation
  },
  /**
   * 从终端询问一个问题，要求从一个列表中选择一项内容
   * @param {问题} questions(String) 
   * @param {选项数组} list(Array)
   * @returns 选择的内容
   */
  list: async (questions,list)=>{
    const obj = [
      {
          type:"expand",
          message: questions,
          name:"occupation",
          choices: list
      }
    ]
    let test = await inquirer.prompt(obj)
    return test.occupation
  }
}
// 相关链接
// https://blog.csdn.net/qq_26733915/article/details/80461257