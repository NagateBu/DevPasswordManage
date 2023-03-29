// 响应式数据
let globeData = new Proxy(
  {
    action: 1, // 当前活动卡片
    list: [], // 数据列表
    stepAction_1: 0, // 项目
    stepAction_2: 0, // 环境
  },
  {
    set(target, p, newValue) {
      if (p == 'action') {
        moveActionItem(newValue)
        moveContentItem(newValue)
        renderingStep2(target.stepAction_1)
      } else if (p == 'list') {
        renderingStep1(newValue)
        renderingStep2(target.stepAction_1)

        chrome.storage.sync.set({options: newValue})
      }

      target[p] = newValue

      return target
    },
  }
)
