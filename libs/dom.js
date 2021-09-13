const dom = {
  $: function (selector) {
    let type = selector.substring(0, 1)
    if (type === '#') {
      if (document.querySelecotor) return document.querySelector(selector)
      return document.getElementById(selector.substring(1))
    } else if (type === '.') {
      if (document.querySelecotorAll) return document.querySelectorAll(selector)
      return document.getElementsByClassName(selector.substring(1))
    } else {
      return document['querySelectorAll' ? 'querySelectorAll' : 'getElementsByTagName'](selector)
    }
  },
  hasClass: function (ele, name) { /* 检测类名 */
    return ele.className.match(new RegExp('(\\s|^)' + name + '(\\s|$)'))
  },
  addClass: function (ele, name) { /* 添加类名 */
    if (!this.hasClass(ele, name)) ele.className += ' ' + name
  },
  removeClass: function (ele, name) { /* 删除类名 */
    if (this.hasClass(ele, name)) {
      let reg = new RegExp('(\\s|^)' + name + '(\\s|$)')
      ele.className = ele.className.replace(reg, '')
    }
  },
  replaceClass: function (ele, newName, oldName) { /* 替换类名 */
    this.removeClass(ele, oldName)
    this.addClass(ele, newName)
  },
  siblings: function (ele) { /* 获取兄弟节点 */
    console.log(ele.parentNode)
    let chid = ele.parentNode.children,
      eleMatch = []
    for (let i = 0, len = chid.length; i < len; i++) {
      if (chid[i] !== ele) {
        eleMatch.push(chid[i])
      }
    }
    return eleMatch
  },
  getByStyle: function (obj, name) { /* 获取行间样式属性 */
    if (obj.currentStyle) {
      return obj.currentStyle[name]
    } else {
      return getComputedStyle(obj, false)[name]
    }
  },
  domToStirng: function (htmlDOM) { /* DOM转字符串 */
    var div = document.createElement('div')
    div.appendChild(htmlDOM)
    return div.innerHTML
  },
  stringToDom: function (htmlString) { /* 字符串转DOM */
    var div = document.createElement('div')
    div.innerHTML = htmlString
    return div.children[0]
  }
}