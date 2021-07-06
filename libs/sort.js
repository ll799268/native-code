/**
 * 冒泡排序（越小的元素会经由交换慢慢“浮”到数列的顶）
 * @param {*} arr 
 * @returns 
 */
function bubbleSort(arr) {
  for (var i = 0; i < arr.length - 1; i++) {
    for (var j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
  }
  return arr
}

/**
 * 选择排序（遍历自身以后的元素，最小的元素跟自己调换位置）
 * @param {*} arr 
 * @returns 
 */
function selectSort(arr) {
  for (var i = 0; i < arr.length - 1; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) {
        [arr[i], arr[j]] = [arr[j], arr[i]]
      }
    }
  }
  return arr
}


/**
 * 插入排序（将元素插入到已排序好的数组中）
 * @param {*} arr 
 */
function insertSort(arr) {
  for (var i = 0; i < arr.length; i++) {
    for (var j = i; j >= 0; j--) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
      }
    }
  }
  return arr
}

/**
 * 快速排序（选择基准值 mid，循环原数组，小于基准值放左边数组，大于放右边数组，然后 concat 组合，最后依靠递归完成排序）
 * @param {*} arr 
 */
function quickSort(arr) {
  if (arr.length <= 1) return arr
  var left = [],
    right = [],
    mid = arr.splice(0, 1)
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] < mid) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  return quickSort(left).concat(mid, quickSort(right))
}