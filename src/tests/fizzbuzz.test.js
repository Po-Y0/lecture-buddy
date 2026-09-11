import test from "node:test";
import assert from "node:assert/strict";

import { fizzBuzz } from "../fizzbuzz.js";

test("Regression - should handle zero as FizzBuzz", () => {
  assert.equal(fizzBuzz(0), "FizzBuzz");
});

test("Regression - should handle negative multiples of 3", () => {
  assert.equal(fizzBuzz(-3), "Fizz");
});

test("Regression - should handle negative multiples of 5", () => {
  assert.equal(fizzBuzz(-5), "Buzz");
});

test("Regression - should handle a regular positive number", () => {
  assert.equal(fizzBuzz(2), "2");
});