;((doc) => {
  document.body.style.margin = 0

  const dom = doc.getElementById('can')
  const oCan = dom.getContext('2d')

  const init = () => {
    dom.width = document.documentElement.clientWidth
    dom.height = document.documentElement.clientHeight
    dom.style.cursor = 'pointer'

    oCan.lineWidth = 10
    oCan.lineCap = 'round'
    oCan.strokeStyle = 'green'

    addEvent()
  }

  const addEvent = () => {
    dom.addEventListener('mousedown', handleMousedown)
  }
  
  const handleMousedown = e => {
    dom.addEventListener('mousemove', handleMousemove)
    dom.addEventListener('mouseup', handleMousemoveEnd)
    const { clientX, clientY } = e
    oCan.beginPath()
    oCan.moveTo(clientX, clientY)
  }
  
  const handleMousemove = e => {
    const { clientX, clientY } = e
    oCan.lineTo(clientX, clientY)
    oCan.stroke()
  }

  const handleMousemoveEnd = e => {
    dom.removeEventListener('mousemove', handleMousemove)
    dom.removeEventListener('mouseup', handleMousemoveEnd)
  }

  init()

})(document)