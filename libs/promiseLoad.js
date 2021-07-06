var errorSrc = '/images/sort/bubbleSort.gif'

function loadImage(url) {
  var image = new Image()
  return new Promise((resolve, reject) => {
    image.src = url
    image.onload = function () {
      resolve('load success')
    }
    image.onerror = function () {
      reject('load error')
      image.src = errorSrc
    }
    document.body.appendChild(image)
  })
}

loadImage('/images/sort/aa.png')
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  })
