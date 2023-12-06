((doc) => {
  const btn = doc.getElementById('btn')
  const pDom = doc.getElementById('app')

  let page = 0
  const size = 50
  const maxSize = 100000

  const render = () => {
    if (page >= Math.ceil(maxSize / size)) return

    const dom = doc.createDocumentFragment()
    for (let i = 0; i < size; i++) {
      const item = doc.createElement('p')
      item.innerText = `第 ${page * size + i} 条`
      dom.appendChild(item)
    }

    page++
    pDom.appendChild(dom)

    requestAnimationFrame(render)
  }
  
  btn.addEventListener('click', render, false)
})(document)