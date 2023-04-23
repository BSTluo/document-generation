import inquirer from 'inquirer';
import * as api from './api/api.js'
import fs from 'fs'
import path from 'path'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
    apiKey: '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'
})
const openai = new OpenAIApi(configuration)


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

async function getAnswerDefault(questions, defValue) {
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
}

const a = {
    objname: '',
    host: '',
    port: '',
    tree: {}
}

const structure = async () => {
    a.objname = await getAnswer('你想制作什么?')
    a.host = await getAnswerDefault('你的后端域名是什么?', '127.0.0.1')
    a.port = await getAnswerDefault('你的后端端口是什么?', '8080')

    let tem = ''
    do {
        tem = await getAnswer('它的功能是由哪些小部分组成?(输入#结束)')
        if (tem !== '#') { a.tree[tem] = {} }
    } while (tem !== '#')

    for (let item of Object.keys(a.tree)) {
        let v = ''
        do {
            v = await getAnswer(`功能 [${item}] 是由什么部分组成的?(输入#结束)`)
            if (v !== '#') {
                a.tree[item][v] = {}
                if (await getAnswer(`它需要调用后端的接口吗?(y/n)`) == 'y') {
                    a.tree[item][v].api = true
                    a.tree[item][v].func = await getAnswer('后端提供的接口需要什么大致功能?')
                    a.tree[item][v].howTo = await getAnswer('大概如何实现它呢?')
                    a.tree[item][v].route = `http://${a.host}:${a.port}${await getAnswerDefault('它的api路由是什么?', '/')}`
                } else {
                    a.tree[item][v].api = false
                }
            } else {
                break
            }
        } while (v !== '#')
    }

    return a
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
        try {
            const completion = await openai.createChatCompletion(gptConfig)
            let gptReturn = completion.data.choices[0].message.content
            const filepath = `./data/${a.objname}/object.md`
            const fileDescriptor = fs.openSync(filepath, 'w');
            fs.writeSync(fileDescriptor, gptReturn);
            fs.closeSync(fileDescriptor);
            console.log(`GPT酱完成了你的活，并且把结果放在了data文件夹下的 [${a.objname}] 文件夹`)
        } catch (err) {
            console.log('GPT酱失联了！')
        }
    } else {
        console.log('GPT酱休息去休息力')
    }
}

const logicObj = await structure()
try {
    fs.mkdirSync(path.join(`./data/${a.objname}`))
} catch (err) { }
api.command.update(path.join(`./data/${a.objname}`), 'object', logicObj)
console.log(`\n\n完成生成啦，请打开data文件夹查看我给你整理在data文件夹内的 [${a.objname}] 文件夹`)

await gpt()