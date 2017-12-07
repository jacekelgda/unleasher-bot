const { Builder, By, Key, until } = require('selenium-webdriver')

const DEVELOPER_UNLEASHER_AUTHOR = 'developer_unleasher'
const WAITING_FOR_RESPONSE = 5000

let driver = new Builder()
    .forBrowser('safari')
    .build()

driver.get('https://jrl-it-nord.slack.com/messages/D5FTEJ85C/')
driver.wait(until.titleIs('Slack'))
driver.findElement(By.name('email')).sendKeys(process.env.email)
driver.findElement(By.name('password')).sendKeys(process.env.password, Key.RETURN)
driver.wait(until.titleIs('developer_unleasher | it-nord Slack'))
driver.findElement(By.id('msg_input')).sendKeys('hi', Key.RETURN)
driver.sleep(WAITING_FOR_RESPONSE);

const trimContent = (content) => {
  return content.replace(/[\r\n\t]+/g, '\n').trim()
}

const compareContent = (content) => {
  const expectedContent = "Hi! I can see that you have no goals yet. Shal we create one?\nCreate Goal\nNot today ...\nContact Real Unleasher"
  if (expectedContent != trimContent(content)) {
    throw 'Content doesn\'t match'
  }
}

const checkIfBotResponded = () => {
  const messageHeaderScript = "return document.querySelector('#msgs_div > .day_container:last-child > .day_msgs > .message:last-child > .message_content > .message_content_header a')"
  return new Promise((resolve, reject) => {
    driver.executeScript(messageHeaderScript).then((el) => {
      el.getText().then((text) => {
        resolve(text)
      })
    })
  })
}

const checkLastMessage = () => {
  const messageContentScript = "return document.querySelector('#msgs_div > .day_container:last-child > .day_msgs > .message:last-child > .message_content > .message_body');"
  return new Promise((resolve, reject) => {
    driver.executeScript(messageContentScript).then((title) => {
      title.getText().then((text) => {
        resolve(text)
      })
    })
  })
}

const init = async () => {
  compareContent(await checkLastMessage())
}

init()


driver.quit()
