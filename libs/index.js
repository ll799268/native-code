// 描述
// 根据包名，在指定空间中创建对象
// 输入描述：
// namespace({a: {test: 1, b: 2}}, 'a.b.c.d')
  // {
  //   a: {
  //     test: 1, 
  //     b: 2
  //   }
  // }, 
  // 'a.b.c.d'
// 输出描述：
// { 
  //   a:
  //   {
  //     test: 1,
  //     b: {
  //       c: {
  //         d: {}
  //       }
  //     }
  //   }
  // }


function namespace(oNamespace, sPackage) {
  const arr = sPackage.split('.')
    arr

  console.log(arr);
  oNamespace[arr[0]]
}

namespace({ a: { test: 1, b: 2 } }, 'a.b.c.d')