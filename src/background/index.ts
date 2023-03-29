// @ts-ignore
chrome.contextMenus.create({
  id: 'DPM_flushed',
  title: '重新寻找密码框',
})

// @ts-ignore
chrome.contextMenus.onClicked.addListener(function () {
  let queryOptions = {active: true}
  // @ts-ignore
  chrome.tabs.query(queryOptions).then((res: any) => {
    const [tab] = res
    // @ts-ignore
    chrome.tabs.sendMessage(tab.id, {type: 'flushed'})
  })
})
