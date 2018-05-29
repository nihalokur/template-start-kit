console.log('loaded')

function foo(n) { 
  var f = (...args) => args[0] + n; 
  return f(10); 
}

console.log(foo(1));