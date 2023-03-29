// 绑定事件
window.onload = function () {
  chrome.storage.sync.get(['options'], (result) => {
    globeData.list = result.options
  })

  const DPM_Tab = document.getElementById('DPM_Tab')

  const DPM_Tools_edit = document.getElementById('DPM_Tools-edit')
  const DPM_Tools_add = document.getElementById('DPM_Tools-add')
  const DPM_Tools_remove = document.getElementById('DPM_Tools-remove')

  const PDM_Model_close = document.getElementById('PDM_Model-close')
  const PDM_Model_submit = document.getElementById('DPM_Model-submit')

  // Event
  DPM_Tab.onclick = handoffItem

  DPM_Tools_add.onclick = () => showModel('add')
  DPM_Tools_edit.onclick = () => showModel('edit')
  DPM_Tools_remove.onclick = removeCurrentItem

  PDM_Model_close.onclick = hideModel
  PDM_Model_submit.onclick = saveModelForm
}
