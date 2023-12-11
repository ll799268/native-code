
var foo = { bar: 1 }
var arr1 = [1, 2, foo] // arr1 = [1, 2, { bar: 1 }]
var arr2 = arr1.slice(1) // arr2 = [2, { bar: 1 }]

arr2[0]++ 
// foo = { bar: 1 }
// arr1 = [1, 2, { bar: 1 }]
// arr2 = [3, { bar: 1 }]

// console.log(foo);
// console.log(arr1);
// console.log(arr2);

arr2[1].bar++ 
// foo = { bar: 2 }
// arr1 = [1, 2, { bar: 2 }]
// arr2 = [3, { bar: 2 }]

// console.log(foo);
// console.log(arr1);
// console.log(arr2);

foo.bar++  
// foo = { bar: 3 }
// arr1 = [1, 2, { bar: 3 }]
// arr2 = [3, { bar: 3 }]

// console.log(foo);
// console.log(arr1);
// console.log(arr2);

arr1[2].bar++ 
// foo = { bar: 4 }
// arr1 = [1, 2, { bar: 4 }]
// arr2 = [3, { bar: 4 }]

// console.log(foo);
// console.log(arr1);
// console.log(arr2);

// console.log('q': arr1[1] === arr2[0]) // false
// console.log('q', arr1[2] === arr2[1]) // true
// console.log('q', foo.bar) // 4