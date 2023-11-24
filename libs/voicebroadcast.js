
/**
 * 语音播放
 */
class Voicebroadcast {
  constructor (el) {
    this.el = el
    this.ipVal = ''
    this.init()
  }

  init () {
    this.initDom()
    this.bindEvent()
  }

  initDom () {
    let button = document.createElement('button')
    button.innerHTML = '播放'
    button.style.marginLeft = '20px'

    let ip = document.createElement('input')
    ip.type = 'text'

    this.el.appendChild(ip)
    this.el.appendChild(button)
  }

  bindEvent () {
    this.el.querySelector('button').addEventListener('click', this._speechSynthesisUtterance.bind(this), false)
    this.el.querySelector('input').addEventListener('input', this._ipChange.bind(this), false)
  }

  _ipChange () {
    this.ipVal = this.el.querySelector('input').value
  }

  _speechSynthesisUtterance () {
    let utterThis = new SpeechSynthesisUtterance(this.ipVal)
    speechSynthesis.speak(utterThis);
  }
 
}

const voicebroadcast = new Voicebroadcast(document.getElementById('app'))
