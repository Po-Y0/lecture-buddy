export function fizzBuzz(number) {
  let result = "";

  if (number % 3 === 0) {
    result += "Fizz";
  }

  if (number % 5 === 0 && number !== 5) {
    result += "Buzz";
  }

  return result || String(number);
}