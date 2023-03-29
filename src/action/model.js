// 显示编辑框
function showModel(type) {
  const modelNode = document.getElementById('DPM_Action-Model')
  const modelContentNode = document.getElementById('DPM_Model-content')
  const modelTitle = document.getElementById('DPM_Model-title')

  let newNode = null

  // 清空内容
  modelContentNode.innerText = ''
  modelNode.style.display = 'flex'

  switch (type) {
    case 'add':
      modelTitle.innerText = globeData.action == 1 ? '新增项目' : '新增环境'
      newNode = createAddOrEditModelContent()

      break
    case 'edit':
      modelTitle.innerText = globeData.action == 1 ? '编辑项目' : '编辑环境'
      newNode = createAddOrEditModelContent(true)

      break
    default:
      return
  }

  modelContentNode.appendChild(newNode)
}

// 新增或编辑内容
function createAddOrEditModelContent(isEdit = false) {
  const {action, list, stepAction_1, stepAction_2} = globeData

  const newNode = document.createElement('div')
  const titleNode = document.createElement('input')
  const accountNode = document.createElement('input')
  const passwordNode = document.createElement('input')

  titleNode.type = 'text'
  titleNode.dataset.isEdit = isEdit ? '1' : '2'

  if (action == 1) {
    titleNode.dataset.key = 'title'
    titleNode.placeholder = '请输入项目名称'
    titleNode.value = isEdit ? list[stepAction_1].title : ''

    newNode.appendChild(titleNode)
  } else {
    titleNode.dataset.key = 'title'
    titleNode.placeholder = '请输入名称'
    titleNode.value = isEdit == '1' ? list[stepAction_1].children[stepAction_2].title : ''

    accountNode.dataset.key = 'account'
    accountNode.placeholder = '请输入账号'
    accountNode.value = isEdit == '1' ? list[stepAction_1].children[stepAction_2].account : ''

    passwordNode.dataset.key = 'password'
    passwordNode.placeholder = '请输入密码'
    passwordNode.value = isEdit == '1' ? list[stepAction_1].children[stepAction_2].password : ''

    newNode.appendChild(titleNode)
    newNode.appendChild(accountNode)
    newNode.appendChild(passwordNode)
  }

  return newNode
}

// 确认保存
function saveModelForm() {
  const {action, stepAction_1, stepAction_2, list} = globeData
  const formNodes = document.querySelectorAll(`#DPM_Model-content input`)
  let isEdit = false
  let isBad = false
  let form = {}

  formNodes.forEach((item) => {
    if (item.dataset.isEdit) {
      isEdit = item.dataset.isEdit == '1'
    }
    if (item.value) {
      form[item.dataset.key] = item.value
    } else {
      isBad = true
      item.style.borderColor = 'red'
    }
  })

  // 判断是否全部填写
  if (isBad) return

  if (action == 1) {
    if (isEdit) {
      list[stepAction_1].title = form.title
    } else {
      list.push({title: form.title, children: []})
    }
  } else {
    if (isEdit) {
      list[stepAction_1].children[stepAction_2].title = form.title
      list[stepAction_1].children[stepAction_2].account = form.account
      list[stepAction_1].children[stepAction_2].password = form.password
    } else {
      list[stepAction_1].children.push({
        title: form.title,
        account: form.account,
        password: form.password,
      })
    }
  }

  globeData.list = list
  hideModel()
}
