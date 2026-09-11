export function isMultiple(number, divisor) {
  return number % divisor === 0;
}

export function fizzBuzzTdd(number) {
  let result = "";

  if (isMultiple(number, 3)) {
    result += "Fizz";
  }

  if (isMultiple(number, 5)) {
    result += "Buzz";
  }

  return result || String(number);
}