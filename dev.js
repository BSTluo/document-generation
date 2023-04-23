import { Configuration, OpenAIApi } from 'openai'
import inquirer from 'inquirer'
import fs from 'fs'
import path from 'path'
import { Buffer } from 'buffer';


const configuration = new Configuration({
    apiKey: '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'
})
const openai = new OpenAIApi(configuration)

const a = {
    objname: "登陆界面",
    host: "127.0.0.1",
    port: "8080",
    tree: {
        登陆界面: {
            账号输入框: {
                api: false
            },
            密码输入框: {
                api: false
            },
            登陆按钮: {
                api: true,
                func: "验证前端输入的账号密码是否正确",
                howTo: "按下登陆按钮后，js获取账号和密输入框内的信息，并确认没有非法符号发送给后端，后端收到前端传入登陆信息后，与数据库内存储的信息对比，是否正确，正确则返回true，错误则返回false",
                route: "http://127.0.0.1:8080/login"
            }
        }
    }
}

async function getAnswer(questions) {
    const obj = [
        {
            type: "input",
            message: questions,
            name: "occupation"
        }
    ]
    let test = await inquirer.prompt(obj)
    return test.occupation
}

const gpt = async () => {
    const gptOpen = await getAnswer('要请GPT酱帮你整理一份项目文档咩?(y/n)')
    if (gptOpen == "y") {
        console.log('GPT酱工作ing！')
        const gptConfig = {
            model: 'gpt-3.5-turbo',
            messages: [
                {
                   "role": "user",
                   "content": `这个是一个我马上要做的项目的项目结构的Json文档，请帮我生成一个项目文档！${JSON.stringify(a, null, 3)}`
                }
             ]
        }
        
        const completion = await openai.createChatCompletion(gptConfig)
        let gptReturn = completion.data.choices[0].message.content
        const filepath = `./data/${a.objname}/object.md`
        const fileDescriptor = fs.openSync(filepath, 'w');
        fs.writeSync(fileDescriptor, gptReturn);
        // 4.关闭文件
        fs.closeSync(fileDescriptor);
        
        console.log(`GPT酱完成了你的活，并且把结果放在了data文件夹下的 [${a.objname}] 文件夹`)
    } else {
        console.log('GPT酱休息去休息力')
    }
}
try{
    fs.mkdirSync(path.join(`./data/${a.objname}`))
}catch(err){}
await gpt()