import test from "node:test";
import assert from "node:assert/strict";
import { fizzBuzz } from "../fizzbuzz.js";

test("should return Fizz for multiples of 3", () => {
  assert.equal(fizzBuzz(3), "Fizz");
});

test("should return Buzz for multiples of 5", () => {
  assert.equal(fizzBuzz(5), "Buzz");
});

test("should return FizzBuzz for multiples of 15", () => {
  assert.equal(fizzBuzz(15), "FizzBuzz");
});

test("should return the number for other numbers", () => {
  assert.equal(fizzBuzz(1), "1");
});