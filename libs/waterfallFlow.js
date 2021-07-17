/**
 * 瀑布流布局
 */

class WaterfallFlow {
  constructor() {
    this.records = [
      {
        "id": 44,
        "name": "三九999感冒灵颗粒 10g*9袋 用于感冒引起的头痛发热鼻塞流涕咽痛",
        "price": 15.7,
        "number": 0,
        "skus": null,
        "imgList": [
          "normal/1622566826267.jpg"
        ],
        "mainUrl": "normal/1622566826267.jpg",
        "originPrice": 18,
        "tags": "退货包运费",
        "details": null,
        "type": null
      },
      {
        "id": 77,
        "name": "丹龙 黄芪精颗粒",
        "price": 225,
        "number": 0,
        "skus": null,
        "imgList": [
          "normal/1622618806004.jpg"
        ],
        "mainUrl": "normal/1622618806004.jpg",
        "originPrice": 226,
        "tags": "退货包运费",
        "details": null,
        "type": null
      },
      {
        "id": 78,
        "name": "丽珠 抗病毒颗粒 无糖型",
        "price": 26.5,
        "number": 0,
        "skus": null,
        "imgList": [
          "normal/1622618926277.jpg"
        ],
        "mainUrl": "normal/1622618926277.jpg",
        "originPrice": 28,
        "tags": "退货包运费",
        "details": null,
        "type": null
      },
      {
        "id": 79,
        "name": "清开灵颗粒",
        "price": 17.5,
        "number": 0,
        "skus": null,
        "imgList": [
          "normal/1622619061750.jpeg"
        ],
        "mainUrl": "normal/1622619061750.jpeg",
        "originPrice": 20,
        "tags": "退货包运费",
        "details": null,
        "type": null
      },
      {
        "id": 80,
        "name": "太龙 双黄连口服液",
        "price": 17.2,
        "number": 0,
        "skus": null,
        "imgList": [
          "normal/1622619227631.jpg"
        ],
        "mainUrl": "normal/1622619227631.jpg",
        "originPrice": 20,
        "tags": "退货包运费",
        "details": null,
        "type": null
      },
      {
        "id": 81,
        "name": "以岭连花清瘟胶囊",
        "price": 17.2,
        "number": 0,
        "skus": null,
        "imgList": [
          "normal/1622619358491.jpg"
        ],
        "mainUrl": "normal/1622619358491.jpg",
        "originPrice": 20,
        "tags": "退货包运费",
        "details": null,
        "type": null
      },
      {
        "id": 103,
        "name": "收到",
        "price": 454646,
        "number": 0,
        "skus": null,
        "imgList": [
          "normal/1624331806836.png"
        ],
        "mainUrl": "normal/1624331806836.png",
        "originPrice": 9999,
        "tags": "",
        "details": null,
        "type": null
      },
      {
        "id": 104,
        "name": "非电饭锅",
        "price": 0.01,
        "number": 0,
        "skus": null,
        "imgList": [
          "normal/1624352471069.png"
        ],
        "mainUrl": "normal/1624352471069.png",
        "originPrice": 9999,
        "tags": "",
        "details": null,
        "type": null
      }
    ]

    this.render()
  }

  imgLoad (src, callback) {
    var image = new Image()
    image.src = `https://test.oss.rcdz.runtianjk.cn/${src}`
    var timer = setInterval(() => {
      if (image.complete) {
        callback()
        clearInterval(timer)
      }
    }, 100)
  }

  render () {
    var dom = document.getElementById('app'),
      parentWidth = dom.offsetWidth
  
    this.records.forEach((item, index) => {
  
      this.imgLoad(item.mainUrl, function () {
        var leftVal = index % 2 === 0 ? 0 : (parentWidth / 2) + 2 + 'px',
          topVal = index < 2 ? 0 : parseInt((dom.childNodes[index - 2]).offsetHeight) +
            parseInt((getComputedStyle(dom.childNodes[index - 2]).top).slice(0, -2)) + 8 +
            'px',
          node = document.createElement('div')
  
        node.style.left = leftVal
        node.style.top = topVal
  
        node.innerHTML = `<div class="shop">
            <img src='https://test.oss.rcdz.runtianjk.cn/${item.mainUrl}' />
            <div class="info">
              <p>${item.name}</p>
              <p>${item.tags}</p>
              <p>${item.price}</p>
              <p>${item.originPrice}</p>
            </div>
          </div>`
  
        dom.appendChild(node)
      })
    })
  }

}

export default new WaterfallFlow()