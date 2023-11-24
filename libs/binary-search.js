/**
 * 二分查找
 * @param {*} arr 
 * @param {*} key 
 * @returns 
 */
function binarySearch(arr, key) {
  var low = 0,
    high = arr.length - 1;
  while (low <= high) {
    var mid = parseInt((high + low) / 2);
    if (key === arr[mid]) {
      return mid
    } else if (key > arr[mid]) {
      low = mid + 1
    } else if (key < arr[mid]) {
      high = mid - 1
    } else {
      return -1
    }
  }
}