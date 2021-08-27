/**
 * js版链表
 * 它是有一个头结点以及多个普通节点组成，每个节点有自己的值还有一个next属性指向下一个节点，最后一个节点的next为null
 * 链表就是通过一个个节点连接起来的
 */

const NodeD = {
  value: 4,
  next: null
}
const NodeC = {
  value: 3,
  next: NodeD
}
const NodeB = {
  value: 2,
  next: NodeC
}
const NodeA = {
  value: 1,
  next: NodeB
}
const LinkedList = {
  head: NodeA
}


/**
 * 遍历链表
 * 从head开始，通过next一个一个往下走
 */
const traversal = (linkedList, callback) => {
  const headNode = linkedList.head
  let currentNode = headNode

  while(currentNode.next) {
    callback(currentNode.value)
    currentNode = currentNode.next
  }

  // 处理最后一个节点的值
  callback(currentNode.value)
}

let total = 0
const sum = value => total = total + value
traversal(LinkedList, sum)
console.log(total)

/**
 * 环形链表
 * 如果最后一个节点的next不是null，而是指向第一个节点。循环代码就会陷入死循环
 */
const hasCycle = linkedList => {
  const map = new WeakMap(),
    headNode = linkedList.head
  let current = headNode

  while(current.next) {
    const exist = map.get(current)

    if (exist) return true
    map.set(current, current.value)

    current = current.next
  }

  return false
}

// 检测之前的数组
console.log(hasCycle(LinkedList))

// 来检测一个有环的
const NodeB2 = {
  value: 2
}
const NodeA2 = {
  value: 1,
  next: NodeB2
}
NodeB2.next = NodeA2
const LinkedList2 = {
  head: NodeA2
}

console.log(hasCycle(LinkedList2));