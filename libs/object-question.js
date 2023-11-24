var a = {
  _default: 1,
  toString: function () {
    return this._default++
  }
}

if (a == 1 && a == 2 && a == 3) {
  console.log('aaa');
}