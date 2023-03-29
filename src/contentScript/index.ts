import Tips from './tips'

let passwordNode: HTMLInputElement
let usernameNode: HTMLInputElement
let tips: Tips = new Tips()

window.onload = function () {
  setTimeout(() => {
    flushedPlugin()
  }, 500)
}

// @ts-ignore
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  console.log(request.type)
  if (request.type == 'flushed') {
    flushedPlugin()
  } else {
    tips.inject(request.account, request.password)
  }

  sendResponse(true)
})

function flushedPlugin() {
  const domList: any = document.querySelectorAll('input')

  domList.forEach((item: any, index: number) => {
    let type: string = item.getAttribute('type')

    if (type == 'password') {
      passwordNode = domList[index]
      usernameNode = domList[index - 1]
    }
  })

  if (passwordNode != null) {
    tips.create(usernameNode, passwordNode)

    passwordNode.onclick = function () {
      tips.showView()
    }

    passwordNode.onblur = function () {
      tips.hideView()
    }
  }
}
