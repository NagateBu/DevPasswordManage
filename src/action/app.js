// 隐藏编辑框
function hideModel() {
  const modelNode = document.getElementById('DPM_Action-Model')

  modelNode.style.display = 'none'
}

// 移除当前项
function removeCurrentItem() {
  const {action, list, stepAction_1, stepAction_2} = globeData

  if (action == 1) {
    list.splice(stepAction_1, 1)
  } else {
    list[stepAction_1].children.splice(stepAction_2, 1)
  }

  globeData.list = list
}

// 切换选项
function handoffItem(event) {
  if (event.target.className == 'DPM_Tab-item') {
    globeData.action = event.target.dataset.key
  }
}

// 移动选项卡位置
function moveActionItem(action) {
  const DPM_Tools_remove = document.getElementById('DPM_Tools-remove')
  const DPM_Tools_edit = document.getElementById('DPM_Tools-edit')
  const actionNode = document.getElementById('DPM_Tab-action')

  let isEmpty = true

  if (action == 2) {
    actionNode.style.left = '50%'
    if (globeData.list[globeData.stepAction_1]?.children?.length > 0) {
      isEmpty = false
    }
  } else {
    actionNode.style.left = '0'
    if (globeData.list?.length > 0) {
      isEmpty = false
    }
  }

  if (isEmpty) {
    // Style
    DPM_Tools_remove.style.display = 'none'
    DPM_Tools_edit.style.display = 'none'
  } else {
    // Style
    DPM_Tools_remove.style.display = 'block'
    DPM_Tools_edit.style.display = 'block'
  }
}

// 移动内容位置
function moveContentItem(action) {
  const boatNode = document.getElementById('DPM_Boat')

  if (action == 2) {
    boatNode.style.left = '-292px'
  } else {
    boatNode.style.left = '0'
  }
}

// 移动列表选项
function moveActionStepItem(stepAction_1, action) {
  const actionNode = document.querySelectorAll(`#DPM_Content-step${action} .step-item`)
  actionNode.forEach((itemNode, index) => {
    if (stepAction_1 == index) {
      itemNode.className = 'step-item action'
    } else {
      itemNode.className = 'step-item'
    }
  })
}

// 渲染列表 step1
function renderingStep1(list) {
  const stepNode = document.getElementById('DPM_Content-step1')

  // 清空
  stepNode.innerText = ''

  // 渲染
  list.forEach((item, index) => {
    const stepItem = document.createElement('div')

    stepItem.className = index == globeData.stepAction_1 ? 'step-item action' : 'step-item'

    stepItem.innerText = item.title

    // 切换
    stepItem.onclick = () => {
      globeData.stepAction_1 = index
      globeData.stepAction_2 = 0
      moveActionStepItem(index, 1)
    }

    // 切换至 step 2
    stepItem.ondblclick = () => {
      globeData.action = 2
      globeData.stepAction_1 = index
      globeData.stepAction_2 = 0
      moveActionStepItem(index, 1)
    }

    stepNode.appendChild(stepItem)
  })
}

// 渲染列表 step 2
function renderingStep2(stepAction_1) {
  const stepNode = document.getElementById('DPM_Content-step2')

  // 清空
  stepNode.innerText = ''

  // 渲染
  globeData.list[stepAction_1]?.children?.forEach((item, index) => {
    const stepItem = document.createElement('div')

    stepItem.className = index == globeData.stepAction_2 ? 'step-item action' : 'step-item'

    stepItem.innerText = item.title

    // 切换
    stepItem.onclick = () => {
      moveActionStepItem(index, 2)
    }

    // 填充密码
    stepItem.ondblclick = () => {
      let queryOptions = {active: true}
      chrome.tabs.query(queryOptions).then((res) => {
        console.log(res)
        const [tab] = res
        chrome.tabs.sendMessage(tab.id, {type: 'inject', account: item.account, password: item.password})
      })
    }

    stepNode.appendChild(stepItem)
  })
}
