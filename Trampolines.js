// Using trampolines to manage large recursive loops in JavaScript

/*
In general compiler will often make optimizations to guarantee that the call stack isn’t exceeded when processing large datasets.
However, in JavaScript (V8) compiler we don’t get those optimizations by default. 
This means that when we have a recursive function we could actually crash the JavaScript engine!
*/

// iterative way
const sumBelow = number => {
  let result = 0
for(let i = 0; i <= number; i++) {
    result += i
  }
  return result
}



// Recursive way
const sumBelow = (number, sum = 0) => (
  number === 0 
    ? sum
    : sumBelow(number - 1, sum + number)
)
sumBelow(100000);  // Uncaught RangeError: Maximum call stack size exceeded



//  Trampolines : non-disruptive option
const trampoline = fn => (...args) => {
  let result = fn(...args)
  while (typeof result === 'function') {
    result = result()
  }
  return result
}
const sumBelowRec = (number, sum = 0) => (
  number === 0
    ? sum
    : () => sumBelowRec(number - 1, sum + number)
)
const sumBelow = trampoline(sumBelowRec)
sumBelow(100000)
// returns 5000050000



/*
REfence:
https://blog.logrocket.com/using-trampolines-to-manage-large-recursive-loops-in-javascript-d8c9db095ae3/
*/
