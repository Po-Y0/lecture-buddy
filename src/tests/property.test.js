import test from "node:test";
import assert from "node:assert/strict";
import fc from "fast-check";
import { fizzBuzz } from "../fizzbuzz.js";

test("Property - fizzBuzz always returns a string", () => {
  fc.assert(
    fc.property(fc.integer(), (number) => {
      const result = fizzBuzz(number);

      assert.equal(typeof result, "string");
    })
  );
});

test("Property - multiples of 15 return FizzBuzz", () => {
  fc.assert(
    fc.property(fc.integer(), (number) => {
      const multipleOf15 = number * 15;

      assert.equal(fizzBuzz(multipleOf15), "FizzBuzz");
    })
  );
});

test("Property - multiples of 3 but not 5 return Fizz", () => {
  fc.assert(
    fc.property(fc.integer(), (number) => {
      const multipleOf3 = number * 3;

      fc.pre(multipleOf3 % 5 !== 0);

      assert.equal(fizzBuzz(multipleOf3), "Fizz");
    })
  );
});

test("Property - multiples of 5 but not 3 return Buzz", () => {
  fc.assert(
    fc.property(fc.integer(), (number) => {
      const multipleOf5 = number * 5;

      fc.pre(multipleOf5 % 3 !== 0);

      assert.equal(fizzBuzz(multipleOf5), "Buzz");
    })
  );
});

test("Property - zero is treated as FizzBuzz", () => {
  assert.equal(fizzBuzz(0), "FizzBuzz");
});