require('dotenv').config()
const { Builder, By, Key, until } = require('selenium-webdriver')
const DEVELOPER_UNLEASHER_AUTHOR = 'developer_unleasher'
const WAITING_FOR_RESPONSE = 5000
const I_SEND_CHAT_MESSAGE = 'iSendChatMessage'

let driver = new Builder()
    .forBrowser('safari')
    .build()

driver.get(process.env.url)
driver.wait(until.titleIs('Slack'))
driver.findElement(By.name('email')).sendKeys(process.env.email)
driver.findElement(By.name('password')).sendKeys(process.env.password, Key.RETURN)
driver.wait(until.titleIs('developer_unleasher | it-nord Slack'))

const trimContent = (content) => {
  return content.replace(/[\r\n\t]+/g, '\n').trim()
}

const compareContent = (content, expectedContent) => {
  content = trimContent(content)
  if (content != expectedContent) {
    console.log('Provided: ', content)
    console.log('Expected: ', expectedContent)

    throw 'Content doesn\'t match'
  } else {
    console.log('Test ok.')
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

const getLastMessageInChat = () => {
  const messageContentScript = "return document.querySelector('#msgs_div > .day_container:last-child > .day_msgs > .message:last-child > .message_content > .message_body');"
  return new Promise((resolve, reject) => {
    driver.executeScript(messageContentScript).then((title) => {
      title.getText().then((text) => {
        resolve(text)
      })
    })
  })
}

const compareLastMessageContent = async (expectedContent) => {
  compareContent(await getLastMessageInChat(), expectedContent)
}

const iSendChatMessage = (message) => {
  return driver.findElement(By.id('msg_input')).sendKeys(message, Key.RETURN)
}

const iClickInteractiveMessageButton = async(title) => {
  const messageContentScript = `return document.querySelector("#msgs_div > .day_container:last-child > .day_msgs > .message:last-child > .message_content > .message_body > .attachment_group > .inline_attachment > .column_content button[title='${title}']");`
  driver.executeScript(messageContentScript).then((el) => {
    el.click()
  })
}

const when = (action) => {
  return action()
}

const and = (action) => {
  return action()
}

const chatResponseShouldBe = async (expectation) => {
  driver.sleep(WAITING_FOR_RESPONSE)
  await compareLastMessageContent(expectation)
}

const runExpectations = () => {
  when(() =>
    iSendChatMessage("Hi!"))
  .then(() =>
    chatResponseShouldBe("Hi! I can see that you have no goals yet. Shal we create one?\nCreate Goal\nNot today ...\nContact Real Unleasher"))
  and(() =>
    iClickInteractiveMessageButton("Not today ..."))
  .then(
    chatResponseShouldBe("Ok, thx!"))
}

runExpectations()
driver.quit()
