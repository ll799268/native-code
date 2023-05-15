(() => {
  const dom = document.getElementById('app')
  
  let diffX = 0,
    diffY = 0

  const init = () => {
    initStyle()
    dom.addEventListener('mousedown', handleMouseDown, false)
  }

  const setStyle = configs => {
    for (let config in configs) {
      dom.style[config] = configs[config]
    }
  }

  const initStyle = () => {
    setStyle({
      width: '250px',
      height: '150px',
      position: 'fixed',
      top: '100px',
      left: '50px',
      background: 'red',
      cursor: 'move'
    })
  }


  const handleMouseDown = e => {
    diffX = e.clientX - dom.offsetLeft
    diffY = e.clientY - dom.offsetTop
    dom.addEventListener('mousemove', handleMouseMove, false)
    dom.addEventListener('mouseup', handleMouseUp, false)
  }

  const handleMouseMove = e => {
    const x = e.clientX,
      y = e.clientY
    
    setStyle({
      left: `${x - diffX}px`,
      top: `${y - diffY}px`
    })
  }

  const handleMouseUp = () => {
    dom.removeEventListener('mousemove', handleMouseMove, false)
  }
  

  init();
})();