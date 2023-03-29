import icon from './icon'

interface LedgerChildType {
  title: string
  account: string
  password: string
}

interface LedgerType {
  title: string
  children: LedgerChildType[]
}

class Tips {
  private usernameNode: any
  private passwordNode: any
  private isTrigger: boolean = false

  constructor() {
    this.isTrigger = false
  }

  // 初始化
  create(usernameNode: HTMLInputElement, passwordNode: HTMLInputElement) {
    this.usernameNode = usernameNode
    this.passwordNode = passwordNode
  }

  // 挂载
  showView() {
    let tipsChildNode = this.createTipsChildNode()
    let tipsNode: HTMLDivElement = document.createElement('div')
    const passwordRect = this.passwordNode.getBoundingClientRect()

    // Style
    tipsNode.id = 'DPM_tips'
    tipsNode.style.position = 'absolute'
    tipsNode.style.top = `${passwordRect.y}px`
    tipsNode.style.left = `${passwordRect.x + passwordRect.width - 60}px`
    tipsNode.style.width = `${25}px`
    tipsNode.style.height = `${this.passwordNode.offsetHeight}px`
    tipsNode.style.display = 'flex'
    tipsNode.style.alignItems = 'center'
    tipsNode.style.justifyContent = 'center'
    tipsNode.style.zIndex = '99999999999999'
    tipsNode.style.boxSizing = 'border-box'

    // Event
    // 移入事件
    tipsNode.onmouseover = () => {
      if (!this.isTrigger) {
        this.isTrigger = true
      }
    }

    // 移出
    tipsNode.onmouseleave = () => {
      this.passwordNode.focus()
      this.isTrigger = false
    }

    // 切换
    tipsChildNode.onclick = (ev) => {
      this.passwordNode.focus()
      tipsChildNode.remove()
      this.createProjectModel(tipsNode)
    }

    tipsNode.appendChild(tipsChildNode)
    document.body.appendChild(tipsNode)
  }

  // 卸载
  hideView() {
    let tipsNode: HTMLElement | null = document.getElementById('DPM_tips')

    if (!this.isTrigger) {
      tipsNode?.remove()
    }
  }

  // step 1
  createTipsChildNode(): HTMLDivElement {
    let tipsChildNode: HTMLImageElement = document.createElement('img')

    // Src
    tipsChildNode.src = icon

    // Style
    tipsChildNode.style.width = '25px'
    tipsChildNode.style.height = '25px'
    tipsChildNode.style.cursor = 'pointer'

    return tipsChildNode
  }

  // step 2
  createProjectModel(tipsNode: HTMLDivElement) {
    let projectNode: HTMLDivElement = document.createElement('div')

    // Style
    projectNode.style.position = 'absolute'
    projectNode.style.top = `${this.passwordNode.offsetHeight + 5}px`
    projectNode.style.right = `0`
    projectNode.style.background = '#000000'
    projectNode.style.width = '220px'
    projectNode.style.height = '300px'
    projectNode.style.padding = '8px'
    projectNode.style.borderRadius = '4px'
    projectNode.style.zIndex = '999999999'
    projectNode.style.overflowX = 'auto'

    // 获取数据
    // @ts-ignore
    chrome.storage.sync.get(['options'], (result: any) => {
      const list = result.options || []

      // Node
      if (list?.length > 0) {
        list.forEach((item: LedgerType) => {
          let node = document.createElement('div')

          if (!item.children.length) return

          // Style
          node.style.width = '100%'
          node.style.fontSize = '12px'
          node.style.lineHeight = '25px'
          node.style.color = '#cccccc'

          // Text
          node.innerText = item.title

          // Children
          item.children.forEach((CItem: LedgerChildType) => {
            let childNode = document.createElement('div')

            // Style
            childNode.style.width = '100%'
            childNode.style.height = '30px'
            childNode.style.fontSize = '12px'
            childNode.style.lineHeight = '25px'
            childNode.style.color = '#ffffff'
            childNode.style.textIndent = '1em'
            childNode.style.cursor = 'pointer'
            childNode.style.borderRadius = '4px'
            childNode.style.border = '1px solid #000000'

            // Text
            childNode.innerText = CItem.title

            // Event
            childNode.onmouseover = () => {
              childNode.style.border = '1px solid #cccccc'
            }

            childNode.onmouseleave = () => {
              childNode.style.border = '1px solid #000000'
            }

            // Event
            childNode.onclick = () => {
              this.isTrigger = false

              this.inject(CItem.account, CItem.password)

              this.hideView()
            }

            node.appendChild(childNode)
          })

          projectNode.appendChild(node)
        })
      } else {
        let node = document.createElement('div')

        // Style
        node.style.fontSize = '12px'
        node.style.color = '#ffffff'

        projectNode.style.display = 'flex'
        projectNode.style.alignItems = 'center'
        projectNode.style.justifyContent = 'center'

        // Text
        node.innerText = '暂无数据'

        projectNode.appendChild(node)
      }

      tipsNode?.appendChild(projectNode)
    })
  }

  inject(account: string, password: string) {
    let ev = new CustomEvent('change', {
      bubbles: true,
    })
    let ev1 = new CustomEvent('input', {
      bubbles: true,
    })

    this.usernameNode.value = account
    this.passwordNode.value = password

    // 触发事件
    this.usernameNode.dispatchEvent(ev)
    this.passwordNode.dispatchEvent(ev)
    this.usernameNode.dispatchEvent(ev1)
    this.passwordNode.dispatchEvent(ev1)
  }
}

export default Tips
