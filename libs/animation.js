let str = '我是图图小可爱'.split('').reverse().join(''),
  i = str.length

createAnimation()

function createAnimation() {
  var parentNode = document.getElementById('app')

  animationFn()
  function animationFn() {
    if (i <= 0) {
      return
    }
    setTimeout(() => {
      i--
      var spanDom = document.createElement('span')
      spanDom.innerHTML = str[i]
      parentNode.appendChild(spanDom)
      animationFn()
    }, 1000)
  }
}